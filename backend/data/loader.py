import os
import glob
from functools import lru_cache
import pandas as pd
from typing import List

# If user-provided files not present, these are the local paths from your session history.
# The system that deploys this may transform them to URLs; for local testing these are file paths.
FALLBACK_PATHS = [
    "/mnt/data/ipcc_ar6_sample.csv",
    "/mnt/data/iea_weo_sample.csv",
]

EXPECTED_COLUMNS = [
    "provider",
    "scenario",
    "region",
    "variable",
    "year",
    "value",
    "unit",
    "source_url",
    "license",
]


def _read_csv_file(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, dtype=str)  # read everything as str then coerce
    # Ensure columns exist; if missing, try to handle common variants
    cols = [c.strip() for c in df.columns.tolist()]
    df.columns = cols
    # Keep only expected columns if present; otherwise create missing
    for c in EXPECTED_COLUMNS:
        if c not in df.columns:
            df[c] = pd.NA
    df = df[EXPECTED_COLUMNS]
    # Coerce types
    df["year"] = pd.to_numeric(df["year"], errors="coerce").astype("Int64")
    df["value"] = pd.to_numeric(df["value"], errors="coerce").astype(float)
    # Strip whitespace from strings
    for c in ["provider", "scenario", "region", "variable", "unit", "source_url", "license"]:
        df[c] = df[c].astype(str).str.strip().replace("nan", pd.NA)
    return df


@lru_cache(maxsize=1)
def load_all_data(data_dir: str = "data") -> pd.DataFrame:
    """
    Load and combine all CSV files in the `data` directory.
    Falls back to hardcoded paths if no files are found.
    """
    frames: List[pd.DataFrame] = []
    # search for csv files in data_dir
    if os.path.isdir(data_dir):
        files = glob.glob(os.path.join(data_dir, "*.csv"))
    else:
        files = []

    if not files:
        # try fallback known paths
        for path in FALLBACK_PATHS:
            if os.path.isfile(path):
                files.append(path)

    if not files:
        raise FileNotFoundError(
            f"No CSVs found in '{data_dir}' and fallback paths are not present. "
            "Please add your CSV(s) to the data directory."
        )

    for f in files:
        try:
            df = _read_csv_file(f)
            df["__source_file"] = os.path.basename(f)
            frames.append(df)
        except Exception as e:
            # skip bad files but log to console
            print(f"Warning: failed to load {f}: {e}")

    if not frames:
        raise RuntimeError("No data frames loaded from any CSV file.")

    combined = pd.concat(frames, ignore_index=True)
    # Normalize values: drop rows with missing year or value or provider or variable
    combined = combined.dropna(subset=["year", "value", "provider", "variable"])
    # Optionally standardize provider names casing
    combined["provider"] = combined["provider"].str.strip()
    combined["variable"] = combined["variable"].str.strip()
    combined["region"] = combined["region"].fillna("Global").str.strip()
    combined["scenario"] = combined["scenario"].fillna("N/A").str.strip()
    combined = combined.sort_values(by=["provider", "variable", "region", "year"])
    combined.reset_index(drop=True, inplace=True)
    return combined
