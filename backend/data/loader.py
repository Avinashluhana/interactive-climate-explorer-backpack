import os
from functools import lru_cache
import pandas as pd
from typing import List

EXCEL_PATH = "data/R60_bulk.xls"


@lru_cache(maxsize=1)
def load_excel_data() -> pd.DataFrame:
    """
    Load the wide-format XLS (Region, Scenario, Variable, Unit, years..., Notes)
    Convert to long-format and return DataFrame with columns:
      provider, region, scenario, variable, unit, year, value, notes
    provider is set statically to 'IPCC-R6'.
    """
    if not os.path.isfile(EXCEL_PATH):
        raise FileNotFoundError(
            f"Excel file not found at: {EXCEL_PATH}. "
            "Place the file there or update EXCEL_PATH in data/loader.py."
        )

    # Read Excel (.xls uses xlrd engine)
    df = pd.read_excel(EXCEL_PATH, engine="xlrd")

    # Normalize column names
    df.columns = [str(c).strip() for c in df.columns]

    # Identify year columns (simple heuristic: column name is digits and 4 chars)
    year_cols: List[str] = [c for c in df.columns if str(c).strip().isdigit() and len(str(c).strip()) == 4]

    if not year_cols:
        # fallback: any column that looks like an integer year
        year_cols = [c for c in df.columns if str(c).strip().isdigit()]

    if not year_cols:
        raise ValueError("No year columns detected in Excel. Expected columns like 2000,2005,...2100")

    # Ensure id columns exist
    id_vars = []
    for col in ["Region", "Scenario", "Variable", "Unit", "Notes"]:
        if col in df.columns:
            id_vars.append(col)
        else:
            df[col] = pd.NA
            id_vars.append(col)

    # Melt wide->long
    long_df = df.melt(
        id_vars=id_vars,
        value_vars=year_cols,
        var_name="year",
        value_name="value"
    )

    # Rename to consistent column names
    long_df.rename(columns={
        "Region": "region",
        "Scenario": "scenario",
        "Variable": "variable",
        "Unit": "unit",
        "Notes": "notes"
    }, inplace=True)

    # provider static (no provider column in XLS)
    long_df["provider"] = "IPCC-R6"

    # Coerce year and numeric values
    # sometimes the year columns are numbers so they become int/float: cast explicitly
    long_df["year"] = pd.to_numeric(long_df["year"], errors="coerce").astype("Int64")
    long_df["value"] = pd.to_numeric(long_df["value"], errors="coerce")

    # Trim whitespace for text columns and replace "nan" strings introduced by pandas
    for c in ["provider", "region", "scenario", "variable", "unit", "notes"]:
        if c in long_df.columns:
            long_df[c] = long_df[c].astype(object).where(long_df[c].notna(), None)
            # If it's a string, strip; if None leave it
            long_df[c] = long_df[c].apply(lambda v: v.strip() if isinstance(v, str) else None)

    # Drop rows that miss required fields (year, value, region, variable)
    long_df = long_df.dropna(subset=["year", "value", "region", "variable"])

    # Convert types to safe python types
    long_df["year"] = long_df["year"].astype(int)
    long_df["value"] = long_df["value"].astype(float)

    # Sort for consistent output
    long_df = long_df.sort_values(by=["region", "scenario", "variable", "year"]).reset_index(drop=True)

    return long_df
