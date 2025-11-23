from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import pandas as pd

from data.loader import load_all_data
from schemas.dataset_schema import DatasetRow

router = APIRouter()


@router.get("/providers", response_model=List[str])
def list_providers():
    df = load_all_data()
    return sorted(df["provider"].dropna().unique().tolist())


@router.get("/variables", response_model=List[str])
def list_variables(provider: Optional[str] = Query(None, description="Optional provider to filter variables")):
    df = load_all_data()
    if provider:
        df = df[df["provider"] == provider]
    return sorted(df["variable"].dropna().unique().tolist())


@router.get("/regions", response_model=List[str])
def list_regions(provider: Optional[str] = Query(None)):
    df = load_all_data()
    if provider:
        df = df[df["provider"] == provider]
    return sorted(df["region"].dropna().unique().tolist())


@router.get("/datasets", response_model=List[DatasetRow])
def query_datasets(
    provider: Optional[str] = Query(None),
    variable: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    scenario: Optional[str] = Query(None),
    start_year: Optional[int] = Query(None),
    end_year: Optional[int] = Query(None),
    limit: int = Query(1000, ge=1, le=10000),
):
    """
    Returns an array of rows matching filters (provider, variable, region, scenario, year range).
    Example:
        /api/datasets?provider=IPCC&variable=CO2%20Emissions&region=Global&start_year=2020&end_year=2040
    """
    df = load_all_data()

    if provider:
        df = df[df["provider"] == provider]
    if variable:
        df = df[df["variable"] == variable]
    if region:
        df = df[df["region"] == region]
    if scenario:
        df = df[df["scenario"] == scenario]

    if start_year is not None:
        df = df[df["year"] >= start_year]
    if end_year is not None:
        df = df[df["year"] <= end_year]

    # sort by year
    df = df.sort_values(by=["year"])
    # cap results
    df = df.head(limit)

    # convert to list of DatasetRow
    results = []
    for _, row in df.iterrows():
        results.append(
            DatasetRow(
                provider=row["provider"],
                scenario=row.get("scenario", "N/A") or "N/A",
                region=row.get("region", "Global") or "Global",
                variable=row["variable"],
                year=int(row["year"]),
                value=float(row["value"]),
                unit=row.get("unit") if pd.notna(row.get("unit")) else None,
                source_url=row.get("source_url") if pd.notna(row.get("source_url")) else None,
                license=row.get("license") if pd.notna(row.get("license")) else None,
            ).dict()
        )

    return results


@router.get("/datasets/{provider_name}", response_model=List[DatasetRow])
def datasets_by_provider(provider_name: str, limit: int = Query(2000, ge=1, le=10000)):
    df = load_all_data()
    df = df[df["provider"] == provider_name]
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data for provider '{provider_name}'")
    df = df.sort_values(by=["variable", "region", "year"]).head(limit)
    return [
        DatasetRow(
            provider=row["provider"],
            scenario=row.get("scenario", "N/A") or "N/A",
            region=row.get("region", "Global") or "Global",
            variable=row["variable"],
            year=int(row["year"]),
            value=float(row["value"]),
            unit=row.get("unit") if pd.notna(row.get("unit")) else None,
            source_url=row.get("source_url") if pd.notna(row.get("source_url")) else None,
            license=row.get("license") if pd.notna(row.get("license")) else None,
        ).dict()
        for _, row in df.iterrows()
    ]
