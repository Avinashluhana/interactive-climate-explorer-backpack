# Climate Explorer Backend (FastAPI)

## 🚀 Overview
The **Climate Explorer Backend** is a FastAPI-based service that loads climate scenario data from an Excel (.xls) file and exposes a clean API for querying variables, regions, scenarios, and time-series datasets. It powers the Climate Explorer Frontend Dashboard.

---

## 📦 Setup Instructions
### **1. Create Virtual Environment (Recommended: Python 3.11)**
```bash
python -m venv .venv
```
Activate it:
- Windows PowerShell:
```bash
.venv\Scripts\Activate.ps1
```
- macOS/Linux:
```bash
source .venv/bin/activate
```

### **2. Install Dependencies**
```bash
pip install fastapi uvicorn pandas xlrd==2.0.1
```

### **3. Place Dataset File**
Place the Excel file at:
```
/mnt/data/R60_bulk.xls
```
or update the path inside `data/loader.py`.

### **4. Run the API**
```bash
python -m uvicorn main:app --reload --port 8000
```
The API will be available at:
```
http://127.0.0.1:8000
```
Swagger UI:
```
http://127.0.0.1:8000/docs
```

---

## 📚 API Endpoints

### ✔ **List Providers**
`GET /api/providers`

### ✔ **List Variables**
`GET /api/variables`

### ✔ **List Regions**
`GET /api/regions`

### ✔ **List Scenarios**
`GET /api/scenarios`

### ✔ **Query Datasets**
Example:
```
/api/datasets?region=World&variable=Concentration%20-%20CO2&start_year=2000&end_year=2050
```

### ✔ **Get All Data for a Provider**
```
/api/datasets/provider/IPCC-R6
```

---

## 🖥 cURL Examples

### List all providers
```bash
curl -s "http://127.0.0.1:8000/api/providers"
```

### List variables
```bash
curl -s "http://127.0.0.1:8000/api/variables"
```

### List regions
```bash
curl -s "http://127.0.0.1:8000/api/regions"
```

### List scenarios
```bash
curl -s "http://127.0.0.1:8000/api/scenarios"
```

### Get dataset (no filters)
```bash
curl -s "http://127.0.0.1:8000/api/datasets"
```

### Filter by region + variable
```bash
curl -s "http://127.0.0.1:8000/api/datasets?region=World&variable=Concentration%20-%20CO2&start_year=2030&end_year=2100"
```

### Get provider data
```bash
curl -s "http://127.0.0.1:8000/api/datasets/provider/IPCC-R6"
```

---

## 📘 Sample JSON Responses

### **1. /api/providers**
```json
[
  "IPCC-R6"
]
```

### **2. /api/variables**
```json
[
  "Concentration - CO2",
  "Concentration - CH4",
  "CO2 emissions - Total",
  "CH4 emissions - Total"
]
```

### **3. /api/datasets (filtered)**
```json
[
  {
    "provider": "IPCC-R6",
    "scenario": "AIM - RCP 6.0",
    "region": "World",
    "variable": "Concentration - CO2",
    "unit": "ppm",
    "year": 2030,
    "value": 428.876,
    "notes": null
  },
  {
    "provider": "IPCC-R6",
    "scenario": "AIM - RCP 6.0",
    "region": "World",
    "variable": "Concentration - CO2",
    "unit": "ppm",
    "year": 2040,
    "value": 450.698,
    "notes": null
  }
]
```

### **4. /api/datasets/provider/IPCC-R6**
```json
[
  {
    "provider": "IPCC-R6",
    "scenario": "AIM - RCP 6.0",
    "region": "World",
    "variable": "Forcing - Total",
    "unit": "W/m2",
    "year": 2000,
    "value": 1.723,
    "notes": "Total radiative forcing excludes mineral dust and the effect of land albedo."
  }
]
```

---

## 🗂 Data Structure
### Input XLS Columns
- Region
- Scenario
- Variable
- Unit
- 2000, 2005, 2010 … 2100
- Notes

### Output JSON Schema
```json
{
  "provider": "IPCC-R6",
  "region": "string",
  "scenario": "string",
  "variable": "string",
  "unit": "string or null",
  "year": 2000,
  "value": 123.45,
  "notes": "string or null"
}
```

---

## 🏗 Architecture Overview
- **FastAPI** backend
- **Excel (.xls) loader** converts dataset from wide → long format
- **Reusable API routes** for variables, regions, scenarios, and time-series
- **CORS enabled** for frontend usage

---

## 🙌 Credits
Developed as part of the **HIS Project — Climate Data Explorer**.

