# Climate Scenario Dataset Documentation

This repository contains two major climate scenario datasets used for climate modeling, visualization, and integrated assessment applications:

1. **RCP 6.0 (R60_bulk.xls)**
2. **SSP CMIP6 Scenario Data (SSP_CMIP6_201811.csv)**

These datasets follow IPCC and CMIP standards and are designed for use in backend services (e.g., FastAPI) and visualization frontends.

---

## Overview

This project supports an **Interactive Climate Scenario Explorer** that allows users to visualize emissions (CO₂, CH₄, Black Carbon, etc.) under multiple global warming pathways.  
The datasets included here cover both **historical and projected emissions** from two important scenario families:

- **RCP (Representative Concentration Pathways)**
- **SSP (Shared Socioeconomic Pathways — CMIP6 Generation)**

Both datasets contain _multi-gas emission trajectories, energy variables, and climate forcing projections_.

---

# 1. Dataset Descriptions

## **A. RCP 6.0 (R60_bulk.xls)**

**Source:** IIASA / IPCC  
**Scenario Type:** Medium–High Emissions  
**Radiative Forcing:** ~6.0 W/m² by 2100  
**Climate Outcome:** ~3–3.7°C global warming  
**Format:** Excel (.xls)

### Key Characteristics

- Emissions continue rising through mid-century before stabilizing
- Weak policy implementation
- Higher energy demand
- Medium–high long-term radiative forcing

### Variables Included

- CO₂ emissions (GtCO₂ / year)
- CH₄ emissions (MtCH₄ / year)
- N₂O emissions
- Black Carbon and Aerosols
- Energy demand and population projections
- Radiative forcing components

### General Structure

| Column   | Description                  |
| -------- | ---------------------------- |
| Region   | Global or region code        |
| Variable | Emission or forcing variable |
| Year     | Projection year (2000–2100)  |
| Value    | Data value                   |
| Unit     | Unit of measurement          |

---

## **B. SSP CMIP6 (SSP_CMIP6_201811.csv)**

**Source:** IIASA / IAMC SSP Database  
**Scenario Type:** Modern IPCC AR6 climate scenarios  
**Format:** CSV

### Key Characteristics

- Updated models used in CMIP6 climate simulations
- Includes SSP pathways (SSP1, SSP2, SSP3, SSP4, SSP5)
- Covers all major radiative forcing levels (1.9, 2.6, 4.5, 6.0, 7.0, 8.5)
- **SSP4-6.0** and **SSP3-7.0** are closest to RCP 6.0

### Variables Included

- Greenhouse gas emissions (CO₂, CH₄, N₂O, F-gases)
- Aerosols (BC, OC, SO₂)
- Land use & energy system variables
- Climate forcing components
- Population & GDP projections

# General Structure

| Column    | Description              |
| --------- | ------------------------ |
| MODEL     | IAM model name           |
| SCENARIO  | e.g., SSP4-6.0           |
| REGION    | Global, OECD, ASIA, etc. |
| VARIABLE  | Emission/energy variable |
| UNIT      | Units of measurement     |
| 2000–2100 | Year-wise values         |

---

# 2. Scenario Background

## **What is RCP 6.0?**

RCP 6.0 is a **stabilization scenario** with medium–high emissions.

- Emissions rise until ~2080
- Policies slow down but do not cut emissions significantly
- Radiative forcing reaches **6.0 W/m²** by 2100
- Used in CMIP5 models (IPCC AR5 generation)

---

## What is SSP (CMIP6) Data?

SSPs describe **socioeconomic futures** combined with emissions pathways.  
SSP CMIP6 is newer and used in **IPCC AR6**.

Examples:

- **SSP4–6.0:** Modern equivalent to RCP 6.0
- **SSP3–7.0:** Medium-high emissions
- **SSP2–4.5:** Middle-of-road
- **SSP1–1.9:** 1.5°C pathway

---

# 3. Unified Backend Schema

Both datasets can be converted into a unified format used by the backend:

| Field      | Description                            |
| ---------- | -------------------------------------- |
| provider   | Dataset source (IPCC, IIASA, CMIP6)    |
| scenario   | Scenario name (RCP6.0, SSP4-6.0, etc.) |
| region     | Geographic region                      |
| variable   | Emission variable                      |
| year       | Year                                   |
| value      | Numeric value                          |
| unit       | Unit                                   |
| source_url | Original dataset link                  |
| license    | Usage license                          |

Example entry:

```
IPCC, RCP6.0, Global, CO2 Emissions, 2030, 40.2, GtCO2, https://tntcat.iiasa.ac.at/RcpDb/, CC-BY-4.0
```

---

# 4. Data Sources & Links

### ✔ RCP 6.0

IIASA RCP Database (official host):  
https://tntcat.iiasa.ac.at/RcpDb/

### ✔ SSP CMIP6

IAMC/IIASA CMIP6 Database:  
https://tntcat.iiasa.ac.at/SspDb/

---

# 5. Licensing

Both datasets are typically provided under:

- **Creative Commons CC-BY-4.0**  
  Check each variable’s metadata before commercial use.

---

# 7. Recommended Folder Structure

/data
├── RCP60/
│ └── R60_bulk.csv
├── SSP_CMIP6/
│ └── SSP_CMIP6_201811.csv
/backend
/frontend
README.md

---

# 8. Validation

Before using the datasets, validate:

- Missing values
- Unit consistency
- Region mapping
- Year alignment (especially SSP 2010–2020 ranges)

# 9.Credits

Data from:

- IIASA RCP Database
- IIASA IAMC SSP CMIP6 Database
- IPCC AR5 and AR6 Contributors

# Steps for Database Integration

## Step 1: Structure & Model Data

- Treat each CSV/XLS as a table
- Define columns, data types, primary keys
- Identify relationships between files (foreign keys)

---

## Step 2: Choose & Design the Database

- Select an RDBMS (SQLite → PostgreSQL/MySQL)
- Create tables using SQL based on your data model
- Add constraints (PK, FK, UNIQUE)

---

## Step 3: Migrate Data

- Import CSV/XLS data into the database
- Clean and validate data during import
- Verify row counts and relationships

---

## Step 4: Integrate with the Application

- Replace file-based access with DB queries
- Use a data access layer / ORM
- Optimize and scale (indexes, backups)
