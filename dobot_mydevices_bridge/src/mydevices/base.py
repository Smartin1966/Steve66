"""Publisher interface for sending telemetry to a myDevices backend."""

from __future__ import annotations

import abc


class TelemetryPublisher(abc.ABC):
    """A backend that can accept a flat dict of telemetry values."""

    name: str = "publisher"

    @abc.abstractmethod
    def connect(self) -> None:
        """Establish any persistent connection needed (idempotent)."""

    @abc.abstractmethod
    def publish(self, telemetry: dict) -> None:
        """Send one telemetry snapshot. Should raise on failure, not swallow it."""

    def close(self) -> None:
        """Release resources. Default no-op for stateless publishers."""
