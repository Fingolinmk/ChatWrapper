import pytest
from datetime import datetime

from app.transaction_type.transaction_type_controller import split_period


def test_split_period_monthly():
    start = datetime(2024, 1, 2)
    end = datetime(2024, 12, 20)
    arrangement = "monthly"

    expected_periods = [
        (datetime(2024, 1, 2), datetime(2024, 1, 31)),
        (datetime(2024, 2, 1), datetime(2024, 2, 29)),
        (datetime(2024, 3, 1), datetime(2024, 3, 31)),
        (datetime(2024, 4, 1), datetime(2024, 4, 30)),
        (datetime(2024, 5, 1), datetime(2024, 5, 31)),
        (datetime(2024, 6, 1), datetime(2024, 6, 30)),
        (datetime(2024, 7, 1), datetime(2024, 7, 31)),
        (datetime(2024, 8, 1), datetime(2024, 8, 31)),
        (datetime(2024, 9, 1), datetime(2024, 9, 30)),
        (datetime(2024, 10, 1), datetime(2024, 10, 31)),
        (datetime(2024, 11, 1), datetime(2024, 11, 30)),
        (datetime(2024, 12, 1), datetime(2024, 12, 20)),
    ]

    result = split_period(start, end, arrangement)
    assert set(result) == set(expected_periods)
