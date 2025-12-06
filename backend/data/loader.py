import os
from functools import lru_cache
import pandas as pd

EXCEL_PATH = "data/R60_bulk.xls"
CSV_PATH = "data/SSP_CMIP6_201811.csv"


# -------------------------------
# 1. LOAD XLS (IPCC-R6)
# -------------------------------
def load_ipcc_excel() -> pd.DataFrame:
    if not os.path.isfile(EXCEL_PATH):
        raise FileNotFoundError(f"Missing XLS file at {EXCEL_PATH}")

    df = pd.read_excel(EXCEL_PATH, engine="xlrd")
    df.columns = [str(c).strip() for c in df.columns]

    year_cols = [c for c in df.columns if c.isdigit()]
    id_vars = ["Region", "Scenario", "Variable", "Unit", "Notes"]

    for col in id_vars:
        if col not in df.columns:
            df[col] = None

    long_df = df.melt(
        id_vars=id_vars,
        value_vars=year_cols,
        var_name="year",
        value_name="value"
    )

    long_df.rename(columns={
        "Region": "region",
        "Scenario": "scenario",
        "Variable": "variable",
        "Unit": "unit",
        "Notes": "notes"
    }, inplace=True)

    long_df["provider"] = "IPCC-R6"
    long_df["year"] = pd.to_numeric(long_df["year"], errors="coerce")
    long_df["value"] = pd.to_numeric(long_df["value"], errors="coerce")

    return long_df.dropna(subset=["region", "variable", "year", "value"])


# -------------------------------
# 2. LOAD CSV (New dataset)
# -------------------------------
def load_ssp_csv() -> pd.DataFrame:
    if not os.path.isfile(CSV_PATH):
        return pd.DataFrame()  # CSV optional

    df = pd.read_csv(CSV_PATH)
    df.columns = [str(c).strip() for c in df.columns]

    id_vars = ["MODEL", "SCENARIO", "REGION", "VARIABLE", "UNIT"]
    year_cols = [c for c in df.columns if c.isdigit()]

    long_df = df.melt(
        id_vars=id_vars,
        value_vars=year_cols,
        var_name="year",
        value_name="value"
    )

    long_df.rename(columns={
        "MODEL": "provider",
        "SCENARIO": "scenario",
        "REGION": "region",
        "VARIABLE": "variable",
        "UNIT": "unit",
    }, inplace=True)

    long_df["year"] = pd.to_numeric(long_df["year"], errors="coerce")
    long_df["value"] = pd.to_numeric(long_df["value"], errors="coerce")
    long_df["notes"] = None

    return long_df.dropna(subset=["region", "variable", "year", "value"])


# -------------------------------
# 3. MERGE BOTH DATASETS
# -------------------------------
@lru_cache(maxsize=1)
def load_all_data() -> pd.DataFrame:
    df_excel = load_ipcc_excel()
    df_csv = load_ssp_csv()

    # combine
    combined = pd.concat([df_excel, df_csv], ignore_index=True)

    # final cleanup
    for col in ["provider", "region", "scenario", "variable", "unit"]:
        combined[col] = combined[col].astype(str).str.strip()

    combined["year"] = combined["year"].astype(int)
    combined["value"] = combined["value"].astype(float)

    return combined.sort_values(by=["provider", "region", "scenario", "variable", "year"])
