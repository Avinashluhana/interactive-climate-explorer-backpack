# Climate Explorer Frontend (Prototype)

This is a Vite + React + Tailwind prototype for the Climate Data Explorer frontend.

## Features
- Multi-page dashboard (Dashboard, Compare, Data Repo, About)
- Dark/Light mode toggle (Tailwind)
- Mock data (`src/data/mock_data.json`)
- Plotly.js for charts
- Interactive controls for selecting climate scenarios, variables, and regions

## Pages Overview

### 1. **Dashboard Page**
   - Allows users to explore and visualize climate scenarios.
   - Users can choose a provider, variable, and region, and view the corresponding trends and data in charts and tables.

### 2. **Compare Page**
   - Provides a side-by-side comparison of two climate scenarios.
   - Users can select two different scenarios, variables, and regions to compare their emission trends.

### 3. **Data Repo Page**
   - Displays a repository of underlying climate data.
   - Users can browse through the data and explore various climate scenarios, regions, and variables available in the dataset.

### 4. **About Page**
   - Provides information about the project, including the objectives, datasets used (e.g., RCP 6.0 and SSP CMIP6 scenarios), and detailed descriptions of the dataset sources and methodology.


## Run locally

1. **Navigate to the frontend directory**
cd frontend

2. **Install dependencies**
npm install


3. **Run the development server**
npm run dev

4. **Access the frontend**
The frontend will be available at [http://localhost:5173/](http://localhost:5173/).

**Note:** This prototype uses mock data and does not call the backend. To integrate with your FastAPI backend later, update data fetching in pages to call the API.
