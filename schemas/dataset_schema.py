from pydantic import BaseModel

class Dataset(BaseModel):
    provider: str
    scenario: str
    region: str
    variable: str
    year: int
    value: float
    unit: str
    source_url: str
    license: str
