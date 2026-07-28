"""Generic HTTPS REST publisher for myDevices ingestion endpoints.

Some myDevices accounts/gateways ingest telemetry via a REST API instead of
MQTT. This publisher POSTs a JSON body of ``{"device_id": ..., "data": {...}}``
to a configurable URL with an API key header, and is deliberately generic so
the URL/auth/body shape can be adapted to whatever endpoint the account
actually provides.
"""

from __future__ import annotations

import logging

import requests

from .base import TelemetryPublisher

logger = logging.getLogger(__name__)


class RestPublisher(TelemetryPublisher):
    name = "rest"

    def __init__(
        self,
        url: str,
        api_key: str,
        device_id: str,
        timeout_seconds: float = 10.0,
    ) -> None:
        self.url = url
        self.api_key = api_key
        self.device_id = device_id
        self.timeout_seconds = timeout_seconds
        self._session = requests.Session()
        self._session.headers.update(
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
        )

    def connect(self) -> None:
        # Stateless HTTP client; nothing to establish up front.
        pass

    def close(self) -> None:
        self._session.close()

    def publish(self, telemetry: dict) -> None:
        body = {"device_id": self.device_id, "data": telemetry}
        response = self._session.post(self.url, json=body, timeout=self.timeout_seconds)
        if response.status_code >= 300:
            raise ConnectionError(
                f"myDevices REST publish failed: {response.status_code} {response.text[:200]}"
            )
