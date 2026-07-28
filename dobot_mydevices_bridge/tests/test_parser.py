import pytest
from dobot.parser import (
    DobotResponseError,
    has_any_error,
    parse_numeric_list,
    parse_response,
    parse_single_int,
)


def test_parse_response_pose():
    parsed = parse_response("0,{200.000000,0.000000,150.000000,0.000000},GetPose();")
    assert parsed.error_id == 0
    assert parsed.command == "GetPose"
    assert parsed.payload == "200.000000,0.000000,150.000000,0.000000"


def test_parse_response_robot_mode():
    parsed = parse_response("0,{5},RobotMode();")
    assert parsed.error_id == 0
    assert parsed.command == "RobotMode"
    assert parsed.payload == "5"


def test_parse_response_with_trailing_newline():
    parsed = parse_response("0,{5},RobotMode();\n")
    assert parsed.payload == "5"


def test_parse_response_invalid_raises():
    with pytest.raises(DobotResponseError):
        parse_response("not a dobot response")


def test_parse_numeric_list():
    assert parse_numeric_list("200.0,0.0,150.0,0.0") == [200.0, 0.0, 150.0, 0.0]


def test_parse_numeric_list_empty():
    assert parse_numeric_list("") == []


def test_parse_single_int():
    assert parse_single_int("5") == 5


def test_parse_single_int_empty_raises():
    with pytest.raises(DobotResponseError):
        parse_single_int("")


def test_has_any_error_false_when_empty_brackets():
    assert has_any_error("[],[],[],[]") is False


def test_has_any_error_true_when_code_present():
    assert has_any_error("[15],[],[],[]") is True
