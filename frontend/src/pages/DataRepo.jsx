import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { fetchDatasets } from "../api";

export default function DataRepo() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        setError("");
        // Fetch a reasonably large sample; backend will cap at the limit
        const data = await fetchDatasets({ limit: 5000 });
        setRows(data || []);
      } catch (err) {
        console.error("Failed to load dataset repository", err);
        setError("Failed to load datasets from API.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dataset Repository</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        This view lists the underlying rows served by the FastAPI backend. You
        can use it to quickly inspect which regions, scenarios and variables are
        available.
      </p>

      {loading && <p className="text-sm text-slate-500">Loading datasets…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && rows.length > 0 && (
        <p className="text-xs text-slate-500">
          Showing {rows.length} rows from the climate dataset.
        </p>
      )}

      <DataTable rows={rows} />
    </div>
  );
}
