from pydantic import BaseModel
from typing import Optional


class DatasetRow(BaseModel):
    provider: str
    scenario: str
    region: str
    variable: str
    year: int
    value: float
    unit: Optional[str] = None
    source_url: Optional[str] = None
    license: Optional[str] = None
    notes: Optional[str] = None


class DatasetQueryParams(BaseModel):
    provider: Optional[str] = None
    variable: Optional[str] = None
    region: Optional[str] = None
    scenario: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    limit: Optional[int] = 1000
