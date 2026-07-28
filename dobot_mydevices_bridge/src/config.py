"""Load and lightly validate the bridge's YAML config file."""

from __future__ import annotations

from pathlib import Path

import yaml


class ConfigError(ValueError):
    pass


def load_config(path: str | Path) -> dict:
    path = Path(path)
    if not path.exists():
        raise ConfigError(
            f"config file not found: {path}. Copy config.example.yaml to config.yaml and edit it."
        )
    with path.open("r", encoding="utf-8") as fh:
        config = yaml.safe_load(fh) or {}

    _require(config, "dobot")
    _require(config["dobot"], "ip")
    _require(config, "mydevices")
    _require(config["mydevices"], "backends")

    backends = config["mydevices"]["backends"]
    enabled = [name for name, cfg in backends.items() if cfg.get("enabled")]
    if not enabled:
        raise ConfigError(
            "no myDevices backend is enabled; set mydevices.backends.mqtt.enabled "
            "or mydevices.backends.rest.enabled to true in your config"
        )
    return config


def _require(section: dict, key: str) -> None:
    if key not in section:
        raise ConfigError(f"missing required config key: {key!r}")
