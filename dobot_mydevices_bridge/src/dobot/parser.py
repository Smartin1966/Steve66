"""Parsing helpers for the Dobot MG400 TCP dashboard text protocol.

Responses on the dashboard port (29999) look like::

    ErrorID,{return values...},CommandEcho();

e.g. ``0,{200.000000,0.000000,150.000000,0.000000},GetPose();``

The error-array commands (``GetErrorID``) return a nested structure of the
form ``0,{[],[],[],[]},GetErrorID();`` where each ``[]`` corresponds to a
controller board; a non-empty bracket means at least one active alarm. The
exact alarm codes are undocumented for third-party use, so we only extract
whether *any* alarm is present rather than decoding specific codes.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

_RESPONSE_RE = re.compile(r"^\s*(-?\d+)\s*,\s*\{(.*)\}\s*,\s*(\S*?)\(.*\)\s*;?\s*$", re.DOTALL)


class DobotResponseError(ValueError):
    """Raised when a Dobot TCP response cannot be parsed."""


@dataclass(frozen=True)
class ParsedResponse:
    error_id: int
    payload: str
    command: str


def parse_response(raw: str) -> ParsedResponse:
    """Split a raw Dobot dashboard response into (error_id, payload, command)."""
    if raw is None:
        raise DobotResponseError("empty response")
    match = _RESPONSE_RE.match(raw)
    if not match:
        raise DobotResponseError(f"unrecognized Dobot response: {raw!r}")
    error_id_str, payload, command = match.groups()
    return ParsedResponse(error_id=int(error_id_str), payload=payload, command=command)


def parse_numeric_list(payload: str) -> list[float]:
    """Parse a flat comma-separated payload of numbers, e.g. a pose or joint list."""
    payload = payload.strip()
    if not payload:
        return []
    return [float(value) for value in payload.split(",")]


def parse_single_int(payload: str) -> int:
    """Parse a payload containing a single integer, e.g. RobotMode()."""
    payload = payload.strip()
    if not payload:
        raise DobotResponseError("expected a single integer, got empty payload")
    return int(float(payload))


def has_any_error(payload: str) -> bool:
    """Best-effort check on a GetErrorID() payload for any non-empty alarm bucket."""
    return bool(re.search(r"\d", payload))
