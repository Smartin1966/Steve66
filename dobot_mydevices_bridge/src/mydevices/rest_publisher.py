"""HTTP webhook publisher for myDevices ingestion.

Implements the myDevices HTTP device connector contract
(https://docs.mydevices.com/docs/device/http): a POST to the account's
ingress URL with the API key as a query parameter and a JSON body of the
form::

    {
      "eui": "<device EUI myDevices assigned>",
      "format": "json",
      "data": { ...telemetry fields... }
    }
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
        eui: str,
        format: str = "json",  # noqa: A002 - matches myDevices field name
        timeout_seconds: float = 10.0,
    ) -> None:
        self.url = url
        self.api_key = api_key
        self.eui = eui
        self.format = format
        self.timeout_seconds = timeout_seconds
        self._session = requests.Session()
        self._session.headers.update({"Content-Type": "application/json"})

    def connect(self) -> None:
        # Stateless HTTP client; nothing to establish up front.
        pass

    def close(self) -> None:
        self._session.close()

    def publish(self, telemetry: dict) -> None:
        body = {
            "eui": self.eui,
            "format": self.format,
            "data": telemetry,
        }
        response = self._session.post(
            self.url,
            params={"apiKey": self.api_key},
            json=body,
            timeout=self.timeout_seconds,
        )
        if response.status_code >= 300:
            raise ConnectionError(
                f"myDevices REST publish failed: {response.status_code} {response.text[:200]}"
            )
