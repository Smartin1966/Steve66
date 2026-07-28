"""Console + rotating file logging setup for the bridge."""

from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler


def setup_logging(config: dict) -> None:
    level_name = str(config.get("level", "INFO")).upper()
    level = getattr(logging, level_name, logging.INFO)
    log_file = config.get("file")
    max_bytes = int(config.get("max_bytes", 1_048_576))
    backup_count = int(config.get("backup_count", 3))

    formatter = logging.Formatter(
        fmt="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    root = logging.getLogger()
    root.setLevel(level)
    root.handlers.clear()

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root.addHandler(console_handler)

    if log_file:
        file_handler = RotatingFileHandler(
            log_file, maxBytes=max_bytes, backupCount=backup_count
        )
        file_handler.setFormatter(formatter)
        root.addHandler(file_handler)
