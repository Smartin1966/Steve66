"""TCP client for the Dobot MG400 dashboard/control port (29999).

The MG400 exposes a plain-text, line-based TCP command protocol on port
29999 (dashboard/control), independent of any vendor SDK. This client only
implements the small set of read-only "Get" commands needed for telemetry
monitoring -- it never sends motion or enable/disable commands.

Reference: Dobot TCP-IP Remote Control protocol documentation for MG400/M1.
"""

from __future__ import annotations

import logging
import socket

from .parser import (
    DobotResponseError,
    has_any_error,
    parse_numeric_list,
    parse_response,
    parse_single_int,
)

logger = logging.getLogger(__name__)


class DobotConnectionError(RuntimeError):
    """Raised when the socket connection to the MG400 fails or drops."""


class DobotMG400Client:
    """Minimal read-only client for MG400 telemetry over the dashboard port."""

    def __init__(
        self,
        ip: str,
        port: int = 29999,
        connect_timeout: float = 5.0,
        read_timeout: float = 5.0,
    ) -> None:
        self.ip = ip
        self.port = port
        self.connect_timeout = connect_timeout
        self.read_timeout = read_timeout
        self._sock: socket.socket | None = None

    # -- connection management -------------------------------------------------

    def connect(self) -> None:
        self.close()
        logger.info("Connecting to Dobot MG400 dashboard at %s:%s", self.ip, self.port)
        try:
            sock = socket.create_connection((self.ip, self.port), timeout=self.connect_timeout)
        except OSError as exc:
            raise DobotConnectionError(f"could not connect to MG400 at {self.ip}:{self.port}: {exc}") from exc
        sock.settimeout(self.read_timeout)
        self._sock = sock
        logger.info("Connected to Dobot MG400")

    def close(self) -> None:
        if self._sock is not None:
            try:
                self._sock.close()
            except OSError:
                pass
            self._sock = None

    @property
    def is_connected(self) -> bool:
        return self._sock is not None

    # -- low-level command/response ---------------------------------------------

    def _send_command(self, command: str) -> str:
        if self._sock is None:
            raise DobotConnectionError("not connected to MG400")
        try:
            self._sock.sendall((command + "\n").encode("utf-8"))
            data = self._sock.recv(4096)
        except (OSError, socket.timeout) as exc:
            self.close()
            raise DobotConnectionError(f"communication with MG400 failed: {exc}") from exc
        if not data:
            self.close()
            raise DobotConnectionError("MG400 closed the connection")
        return data.decode("utf-8", errors="replace").strip()

    def _query(self, command: str):
        raw = self._send_command(command)
        try:
            return parse_response(raw)
        except DobotResponseError as exc:
            raise DobotConnectionError(f"unexpected response to {command!r}: {exc}") from exc

    # -- telemetry queries --------------------------------------------------

    def get_robot_mode(self) -> int:
        parsed = self._query("RobotMode()")
        return parse_single_int(parsed.payload)

    def get_pose(self) -> dict[str, float]:
        parsed = self._query("GetPose()")
        values = parse_numeric_list(parsed.payload)
        keys = ["x", "y", "z", "r"]
        return dict(zip(keys, values))

    def get_angles(self) -> dict[str, float]:
        parsed = self._query("GetAngle()")
        values = parse_numeric_list(parsed.payload)
        keys = ["j1", "j2", "j3", "j4"]
        return dict(zip(keys, values))

    def get_has_error(self) -> bool:
        parsed = self._query("GetErrorID()")
        return has_any_error(parsed.payload) or parsed.error_id != 0

    def read_telemetry(self) -> dict:
        """Poll all telemetry points in one pass. Raises DobotConnectionError on failure."""
        telemetry: dict = {"connected": True}
        telemetry["robot_mode"] = self.get_robot_mode()
        telemetry.update({f"pose_{k}": v for k, v in self.get_pose().items()})
        telemetry.update({f"joint_{k}": v for k, v in self.get_angles().items()})
        telemetry["has_error"] = self.get_has_error()
        return telemetry
