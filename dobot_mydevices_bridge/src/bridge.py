"""Polls the Dobot MG400 for telemetry and fans it out to myDevices publishers."""

from __future__ import annotations

import logging
import time

from dobot.client import DobotConnectionError, DobotMG400Client
from mydevices.base import TelemetryPublisher

logger = logging.getLogger(__name__)


class Bridge:
    def __init__(
        self,
        dobot_client: DobotMG400Client,
        publishers: list[TelemetryPublisher],
        poll_interval_seconds: float,
        reconnect_delay_seconds: float,
    ) -> None:
        self.dobot_client = dobot_client
        self.publishers = publishers
        self.poll_interval_seconds = poll_interval_seconds
        self.reconnect_delay_seconds = reconnect_delay_seconds
        self._stop = False

    def stop(self) -> None:
        self._stop = True

    def run_forever(self) -> None:
        for publisher in self.publishers:
            publisher.connect()

        while not self._stop:
            if not self.dobot_client.is_connected:
                if not self._try_connect_dobot():
                    time.sleep(self.reconnect_delay_seconds)
                    continue

            telemetry = self._poll_once()
            if telemetry is not None:
                self._publish(telemetry)

            time.sleep(self.poll_interval_seconds)

        for publisher in self.publishers:
            publisher.close()
        self.dobot_client.close()

    def _try_connect_dobot(self) -> bool:
        try:
            self.dobot_client.connect()
            return True
        except (DobotConnectionError, OSError) as exc:
            logger.warning("Could not connect to Dobot MG400: %s. Retrying in %ss", exc, self.reconnect_delay_seconds)
            return False

    def _poll_once(self) -> dict | None:
        try:
            return self.dobot_client.read_telemetry()
        except DobotConnectionError as exc:
            logger.warning("Lost connection to Dobot MG400: %s", exc)
            self._publish_disconnected()
            return None

    def _publish_disconnected(self) -> None:
        self._publish({"connected": False})

    def _publish(self, telemetry: dict) -> None:
        for publisher in self.publishers:
            try:
                publisher.publish(telemetry)
            except Exception:
                logger.exception("Failed to publish telemetry via %s", publisher.name)
