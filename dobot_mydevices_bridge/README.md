# Dobot MG400 → myDevices Bridge

A small Python program that runs on a PC on the same network as a Dobot
MG400 robot arm, polls the arm's status over TCP, and publishes it to
[myDevices](https://mydevices.com) so it can be monitored on a myDevices
dashboard.

This is **monitoring only**: it reads telemetry from the MG400 and pushes it
out. It never sends motion, enable, or configuration commands to the robot.

## What it reports

Every poll cycle (default every 2 seconds) it reads from the MG400 and
publishes:

| Field | Meaning |
|---|---|
| `connected` | whether the bridge currently has a live connection to the arm |
| `robot_mode` | MG400 `RobotMode()` status code (e.g. disabled, enabled, running, error, ...) |
| `pose_x`, `pose_y`, `pose_z`, `pose_r` | current TCP (end-effector) pose from `GetPose()` |
| `joint_j1`..`joint_j4` | current joint angles from `GetAngle()` |
| `has_error` | best-effort flag derived from `GetErrorID()` — true if any alarm is currently active |

## How it talks to each side

- **Dobot MG400**: connects directly over TCP to the arm's dashboard/control
  port (`29999`), which speaks a plain-text command protocol
  (`GetPose()`, `GetAngle()`, `RobotMode()`, `GetErrorID()`). No vendor SDK
  is required — just a socket on your network to the robot's IP.
- **myDevices**: myDevices' original "Cayenne" product used a documented
  MQTT topic scheme; their current mydevices.com platform is typically
  integrated per-account via an MQTT broker or a REST ingestion endpoint,
  and exact broker/API details depend on what your myDevices
  account/gateway provides. This bridge supports **both**, selected in
  config, so you can point it at whichever your account actually has:
  - `mqtt`: publishes each field to
    `{topic_prefix}/{username}/things/{client_id}/data/{channel}` on a
    Cayenne-style MQTT broker (channel numbers you map in config to match
    your myDevices dashboard widgets).
  - `rest`: POSTs a JSON `{"device_id": ..., "data": {...}}` body to a
    configurable HTTPS endpoint with a bearer API key.
  - Both can be enabled at once.

  **You will need to get the actual broker host/credentials or REST
  endpoint/API key from your myDevices account** — this program does not
  invent an API myDevices doesn't provide; it just implements both common
  integration shapes so you can plug in whichever one your account uses.

## Requirements

- Python 3.9+
- Network access from this PC to the MG400's IP on port 29999
- Network access from this PC to your myDevices MQTT broker or REST endpoint
- `pip install -r requirements.txt`

## Setup

```bash
cd dobot_mydevices_bridge
python3 -m venv .venv
source .venv/bin/activate        # on Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp config.example.yaml config.yaml
# edit config.yaml: set dobot.ip, and fill in mydevices.backends.mqtt
# and/or mydevices.backends.rest with your real credentials
```

### Find your MG400's IP

The MG400 controller's IP is set via DobotStudio or the front panel network
settings and must be reachable from this PC (same LAN/VLAN, port 29999 open).

### Test the Dobot connection without touching myDevices

```bash
python src/main.py --config config.yaml --once
```

This connects once, prints the telemetry snapshot as JSON, and exits —
useful for confirming the IP/port and protocol before wiring up myDevices.

### Test the full loop without actually sending to myDevices

```bash
python src/main.py --config config.yaml --dry-run
```

Polls the arm continuously and logs each telemetry snapshot instead of
publishing it, so you can watch it run before enabling real publishing.

### Run for real

```bash
python src/main.py --config config.yaml
```

Runs until you press Ctrl+C. It automatically reconnects to the MG400 if
the connection drops, and logs (but does not crash on) publish failures to
myDevices.

## Running continuously

### Linux (systemd)

See `deploy/dobot-mydevices-bridge.service` for an example unit file. Copy
it to `/etc/systemd/system/`, edit the paths, then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dobot-mydevices-bridge
sudo journalctl -u dobot-mydevices-bridge -f
```

### Windows

Use Task Scheduler to run at startup:

1. Create a Basic Task, trigger "When the computer starts."
2. Action: "Start a program"
   - Program: `C:\path\to\.venv\Scripts\python.exe`
   - Arguments: `src\main.py --config config.yaml`
   - Start in: `C:\path\to\dobot_mydevices_bridge`
3. Under the task's Settings, enable "Restart if the task fails."

## Configuration reference

See the comments in `config.example.yaml`. Key sections:

- `dobot`: IP/port of the MG400, poll interval, timeouts, reconnect delay.
- `mydevices.backends.mqtt`: broker host/port/TLS/credentials, and
  `channel_map` mapping each telemetry field name to the numeric channel ID
  used on your myDevices dashboard.
- `mydevices.backends.rest`: URL, API key, and device ID for REST ingestion.
- `logging`: level and rotating log file settings.

`config.yaml` is gitignored so credentials never get committed — only
`config.example.yaml` (with placeholder values) is tracked.

## Project layout

```
src/
  main.py            entry point / CLI
  config.py          YAML config loading + validation
  logging_setup.py   console + rotating file logging
  bridge.py          poll/publish orchestration loop
  dobot/
    client.py        TCP client for the MG400 dashboard port
    parser.py         parses the Dobot text protocol responses
  mydevices/
    base.py          publisher interface
    mqtt_publisher.py   Cayenne-style MQTT publisher
    rest_publisher.py   generic REST publisher
tests/               unit tests for the parser and bridge loop (no hardware needed)
deploy/              example systemd unit
```

## Tests

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```

Tests cover the Dobot response parser and the bridge's poll/publish/retry
logic using fakes — no physical MG400 or myDevices account is required to
run them.

## Extending

- To publish additional telemetry (digital I/O, speed factor, etc.), add a
  query method to `DobotMG400Client` (following the existing `Get*()`
  pattern) and include the new field(s) in `read_telemetry()`, then add a
  matching entry to `channel_map` in your config.
- To support a different myDevices integration shape (e.g. a specific
  device-provisioning REST API your account uses), implement
  `TelemetryPublisher` in `src/mydevices/` and wire it up in
  `build_publishers()` in `src/main.py`.
