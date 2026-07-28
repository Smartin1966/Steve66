from dobot.client import DobotConnectionError
from bridge import Bridge


class FakeDobotClient:
    def __init__(self, telemetry_sequence, connect_should_fail=False):
        self._telemetry_sequence = list(telemetry_sequence)
        self._connected = False
        self.connect_should_fail = connect_should_fail
        self.connect_calls = 0
        self.closed = False

    @property
    def is_connected(self):
        return self._connected

    def connect(self):
        self.connect_calls += 1
        if self.connect_should_fail:
            raise DobotConnectionError("simulated connect failure")
        self._connected = True

    def close(self):
        self._connected = False
        self.closed = True

    def read_telemetry(self):
        if not self._telemetry_sequence:
            raise DobotConnectionError("simulated read failure")
        item = self._telemetry_sequence.pop(0)
        if isinstance(item, Exception):
            self._connected = False
            raise item
        return item


class FakePublisher:
    name = "fake"

    def __init__(self):
        self.connected = False
        self.published = []
        self.closed = False

    def connect(self):
        self.connected = True

    def publish(self, telemetry):
        self.published.append(telemetry)

    def close(self):
        self.closed = True


def run_n_iterations(bridge, sleep_calls_container, n):
    def fake_sleep(_seconds):
        sleep_calls_container.append(_seconds)
        if len(sleep_calls_container) >= n:
            bridge.stop()

    return fake_sleep


def test_bridge_publishes_polled_telemetry(monkeypatch):
    dobot = FakeDobotClient(telemetry_sequence=[{"robot_mode": 5}, {"robot_mode": 5}])
    publisher = FakePublisher()
    bridge = Bridge(dobot, [publisher], poll_interval_seconds=0, reconnect_delay_seconds=0)

    sleeps = []
    monkeypatch.setattr("bridge.time.sleep", run_n_iterations(bridge, sleeps, 2))

    bridge.run_forever()

    assert publisher.connected is True
    assert publisher.published == [{"robot_mode": 5}, {"robot_mode": 5}]
    assert dobot.closed is True
    assert publisher.closed is True


def test_bridge_reports_disconnect_on_read_failure(monkeypatch):
    dobot = FakeDobotClient(telemetry_sequence=[DobotConnectionError("dropped")])
    publisher = FakePublisher()
    bridge = Bridge(dobot, [publisher], poll_interval_seconds=0, reconnect_delay_seconds=0)

    sleeps = []
    monkeypatch.setattr("bridge.time.sleep", run_n_iterations(bridge, sleeps, 1))

    bridge.run_forever()

    assert {"connected": False} in publisher.published


def test_bridge_retries_dobot_connect_on_failure(monkeypatch):
    dobot = FakeDobotClient(telemetry_sequence=[{"robot_mode": 5}], connect_should_fail=True)
    publisher = FakePublisher()
    bridge = Bridge(dobot, [publisher], poll_interval_seconds=0, reconnect_delay_seconds=0)

    sleeps = []

    def fake_sleep(_seconds):
        sleeps.append(_seconds)
        if len(sleeps) >= 2:
            dobot.connect_should_fail = False
        if len(sleeps) >= 3:
            bridge.stop()

    monkeypatch.setattr("bridge.time.sleep", fake_sleep)

    bridge.run_forever()

    assert dobot.connect_calls >= 2
    assert publisher.published == [{"robot_mode": 5}]
