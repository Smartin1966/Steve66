"""MQTT publisher for myDevices/Cayenne-style brokers.

Publishes each telemetry field to its own topic using the Cayenne MQTT
topic convention::

    {topic_prefix}/{username}/things/{client_id}/data/{channel}

with the raw value as the payload. ``channel_map`` in the config maps
telemetry field names (e.g. ``pose_x``) to the numeric channel IDs
configured on the myDevices dashboard/device.

This is publish-only (monitoring); no command topics are subscribed to.
"""

from __future__ import annotations

import logging

import paho.mqtt.client as mqtt

from .base import TelemetryPublisher

logger = logging.getLogger(__name__)


class MQTTPublisher(TelemetryPublisher):
    name = "mqtt"

    def __init__(
        self,
        broker_host: str,
        broker_port: int,
        username: str,
        password: str,
        client_id: str,
        channel_map: dict,
        use_tls: bool = True,
        topic_prefix: str = "v1",
        keepalive_seconds: int = 60,
        connect_timeout: float = 10.0,
    ) -> None:
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.username = username
        self.password = password
        self.client_id = client_id
        self.channel_map = channel_map
        self.use_tls = use_tls
        self.topic_prefix = topic_prefix
        self.keepalive_seconds = keepalive_seconds
        self.connect_timeout = connect_timeout

        self._client = mqtt.Client(client_id=client_id, clean_session=True)
        self._client.username_pw_set(username, password)
        if use_tls:
            self._client.tls_set()
        self._client.on_connect = self._on_connect
        self._client.on_disconnect = self._on_disconnect
        self._connected = False

    def _on_connect(self, client, userdata, flags, rc) -> None:  # noqa: ANN001
        if rc == 0:
            self._connected = True
            logger.info("Connected to myDevices MQTT broker %s:%s", self.broker_host, self.broker_port)
        else:
            self._connected = False
            logger.error("myDevices MQTT connect failed with code %s", rc)

    def _on_disconnect(self, client, userdata, rc) -> None:  # noqa: ANN001
        self._connected = False
        if rc != 0:
            logger.warning("Unexpected disconnect from myDevices MQTT broker (rc=%s)", rc)

    def connect(self) -> None:
        if self._connected:
            return
        self._client.connect(self.broker_host, self.broker_port, keepalive=self.keepalive_seconds)
        self._client.loop_start()

    def close(self) -> None:
        self._client.loop_stop()
        self._client.disconnect()
        self._connected = False

    def _topic_for_channel(self, channel: int) -> str:
        return f"{self.topic_prefix}/{self.username}/things/{self.client_id}/data/{channel}"

    def publish(self, telemetry: dict) -> None:
        if not self._connected:
            raise ConnectionError("not connected to myDevices MQTT broker")
        for field, value in telemetry.items():
            channel = self.channel_map.get(field)
            if channel is None:
                continue
            topic = self._topic_for_channel(channel)
            result = self._client.publish(topic, payload=str(value), qos=0, retain=False)
            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                raise ConnectionError(f"failed to publish to {topic}: rc={result.rc}")
