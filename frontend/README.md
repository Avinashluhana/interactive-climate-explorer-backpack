# Climate Explorer Frontend (Prototype)

This is a Vite + React + Tailwind prototype for the Climate Data Explorer frontend.

## Features
- Multi-page dashboard (Dashboard, Compare, Data Repo, About)
- Dark/Light mode toggle (Tailwind)
- Mock data (`src/data/mock_data.json`)
- Plotly.js for charts

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
