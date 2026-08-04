"""Entry point: Dobot MG400 -> myDevices telemetry bridge.

Usage:
    python src/main.py --config config.yaml
    python src/main.py --config config.yaml --once      # single poll, print, exit
    python src/main.py --config config.yaml --dry-run   # poll/log but don't publish
"""

from __future__ import annotations

import argparse
import json
import logging
import signal
import sys

from bridge import Bridge
from config import ConfigError, load_config
from dobot.client import DobotConnectionError, DobotMG400Client
from logging_setup import setup_logging
from mydevices.base import TelemetryPublisher
from mydevices.mqtt_publisher import MQTTPublisher
from mydevices.rest_publisher import RestPublisher

logger = logging.getLogger(__name__)


class _NullPublisher(TelemetryPublisher):
    """Used with --dry-run: logs telemetry instead of sending it anywhere."""

    name = "dry-run"

    def connect(self) -> None:
        pass

    def publish(self, telemetry: dict) -> None:
        logger.info("[dry-run] telemetry: %s", json.dumps(telemetry))


def build_publishers(mydevices_config: dict, dry_run: bool) -> list[TelemetryPublisher]:
    if dry_run:
        return [_NullPublisher()]

    publishers: list[TelemetryPublisher] = []
    backends = mydevices_config["backends"]

    mqtt_config = backends.get("mqtt", {})
    if mqtt_config.get("enabled"):
        publishers.append(
            MQTTPublisher(
                broker_host=mqtt_config["broker_host"],
                broker_port=int(mqtt_config["broker_port"]),
                username=mqtt_config["username"],
                password=mqtt_config["password"],
                client_id=mqtt_config["client_id"],
                channel_map=mqtt_config["channel_map"],
                use_tls=mqtt_config.get("use_tls", True),
                topic_prefix=mqtt_config.get("topic_prefix", "v1"),
                keepalive_seconds=int(mqtt_config.get("keepalive_seconds", 60)),
            )
        )

    rest_config = backends.get("rest", {})
    if rest_config.get("enabled"):
        publishers.append(
            RestPublisher(
                url=rest_config["url"],
                api_key=rest_config["api_key"],
                eui=rest_config["eui"],
                format=rest_config.get("format", "json"),
                timeout_seconds=float(rest_config.get("timeout_seconds", 10.0)),
            )
        )

    return publishers


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Dobot MG400 <-> myDevices telemetry bridge")
    parser.add_argument("--config", default="config.yaml", help="path to config YAML file")
    parser.add_argument("--once", action="store_true", help="poll the arm once, print telemetry, and exit")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="poll the arm but log telemetry instead of publishing to myDevices",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    try:
        config = load_config(args.config)
    except ConfigError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2

    setup_logging(config.get("logging", {}))

    dobot_config = config["dobot"]
    dobot_client = DobotMG400Client(
        ip=dobot_config["ip"],
        port=int(dobot_config.get("dashboard_port", 29999)),
        connect_timeout=float(dobot_config.get("connect_timeout_seconds", 5.0)),
        read_timeout=float(dobot_config.get("read_timeout_seconds", 5.0)),
    )

    if args.once:
        try:
            dobot_client.connect()
            telemetry = dobot_client.read_telemetry()
        except DobotConnectionError as exc:
            logger.error("Failed to poll Dobot MG400: %s", exc)
            return 1
        finally:
            dobot_client.close()
        print(json.dumps(telemetry, indent=2))
        return 0

    publishers = build_publishers(config["mydevices"], dry_run=args.dry_run)
    bridge = Bridge(
        dobot_client=dobot_client,
        publishers=publishers,
        poll_interval_seconds=float(dobot_config.get("poll_interval_seconds", 2.0)),
        reconnect_delay_seconds=float(dobot_config.get("reconnect_delay_seconds", 5.0)),
    )

    def _handle_signal(signum, frame):  # noqa: ANN001
        logger.info("Received signal %s, shutting down...", signum)
        bridge.stop()

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)

    logger.info("Starting Dobot MG400 <-> myDevices bridge")
    bridge.run_forever()
    logger.info("Bridge stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
