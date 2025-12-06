from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

from data.loader import load_all_data
from schemas.dataset_schema import DatasetRow

router = APIRouter()


@router.get("/providers", response_model=List[str])
def list_providers():
    df = load_all_data()
    return sorted(df["provider"].unique().tolist())


@router.get("/variables", response_model=List[str])
def list_variables():
    df = load_all_data()
    return sorted(df["variable"].dropna().unique().tolist())


@router.get("/regions", response_model=List[str])
def list_regions():
    df = load_all_data()
    return sorted(df["region"].dropna().unique().tolist())


@router.get("/scenarios", response_model=List[str])
def list_scenarios():
    df = load_all_data()
    return sorted(df["scenario"].dropna().unique().tolist())


@router.get("/datasets", response_model=List[DatasetRow])
def query_datasets(
        provider: Optional[str] = Query(None),
        region: Optional[str] = Query(None),
        variable: Optional[str] = Query(None),
        scenario: Optional[str] = Query(None),
        start_year: Optional[int] = Query(None),
        end_year: Optional[int] = Query(None),
        limit: int = Query(2000, ge=1, le=10000),
):
    """
    Query API:
      /api/datasets?region=World&variable=Concentration%20-%20CO2&start_year=2030&end_year=2100
    """

    df = load_all_data()  # <-- Cached in memory (VERY fast)

    # --- FAST FILTERING ---
    if provider:
        df = df[df.provider == provider]

    if region:
        df = df[df.region == region]

    if variable:
        df = df[df.variable == variable]

    if scenario:
        df = df[df.scenario == scenario]

    if start_year is not None:
        df = df[df.year >= start_year]

    if end_year is not None:
        df = df[df.year <= end_year]

    # --- LIMIT BEFORE SORTING (FASTER) ---
    if len(df) > limit:
        df = df.iloc[:limit]

    # Sort only the filtered rows
    df = df.sort_values("year")

    # --- SUPER FAST RETURN ---
    # Convert df -> list of dicts directly (no loops)
    records = df.to_dict(orient="records")

    # Pydantic bulk parsing (MUCH faster than row-by-row)
    return [DatasetRow.model_validate(r) for r in records]


@router.get("/datasets/provider/{provider_name}", response_model=List[DatasetRow])
def datasets_by_provider(provider_name: str, limit: int = 2000):
    if provider_name != "IPCC-R6":
        raise HTTPException(status_code=404, detail=f"Provider '{provider_name}' not found.")
    df = load_all_data()
    df = df.sort_values(by=["region", "variable", "year"]).head(limit)

    out = []
    for _, row in df.iterrows():
        out.append(
            DatasetRow(
                provider=row.get("provider") if row.get("provider") is not None else "IPCC-R6",
                region=str(row["region"]),
                scenario=str(row["scenario"]) if row.get("scenario") is not None else "N/A",
                variable=str(row["variable"]),
                unit=str(row["unit"]) if row.get("unit") is not None else None,
                year=int(row["year"]),
                value=float(row["value"]),
                notes=str(row["notes"]) if row.get("notes") is not None else None,
            )
        )
    return out
