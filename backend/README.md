# Climate Explorer Backend (FastAPI)

## Setup
1. Create a virtualenv and install dependencies:
- `python -m venv .venv`
- `source .venv/bin/activate`
- `pip install fastapi uvicorn pandas`


2. Put your CSVs into the `data/` folder. Filenames can be arbitrary CSVs that contain columns:
`provider,scenario,region,variable,year,value,unit,source_url,license`
(Missing columns are tolerated and filled with nulls.)

If you prefer, you can use the sample paths:
- /mnt/data/ipcc_ar6_sample.csv
- /mnt/data/iea_weo_sample.csv

3. Start the API:
- `uvicorn main:app --reload --port 8000`


4. Example endpoints:
- `GET /api/providers`
- `GET /api/variables?provider=IPCC`
- `GET /api/regions`
- `GET /api/datasets?provider=IPCC&variable=CO2 Emissions&region=Global&start_year=2020&end_year=2040`
- `GET /api/datasets/IPCC`



