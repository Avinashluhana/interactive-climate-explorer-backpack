from typing import Optional, Tuple


def normalize_str(s: Optional[str]) -> Optional[str]:
    if s is None:
        return None
    s2 = s.strip()
    return s2 if s2 != "" else None


def clamp_years(start: Optional[int], end: Optional[int]) -> Tuple[Optional[int], Optional[int]]:
    if start is None and end is None:
        return None, None
    if start is None:
        start = -10000
    if end is None:
        end = 99999
    if start > end:
        start, end = end, start
    return start, end
