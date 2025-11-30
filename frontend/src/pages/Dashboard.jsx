import React, { useState, useEffect } from "react";
import ChartView from "../components/ChartView";
import DataTable from "../components/DataTable";
import {
  fetchProviders,
  fetchVariables,
  fetchRegions,
  fetchDatasets,
} from "../api";

export default function Dashboard() {
  const [providers, setProviders] = useState([]);
  const [variables, setVariables] = useState([]);
  const [regions, setRegions] = useState([]);

  const [provider, setProvider] = useState("");
  const [variable, setVariable] = useState("");
  const [region, setRegion] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // Load filter options (providers, variables, regions) from backend
  useEffect(() => {
    async function loadOptions() {
      try {
        setInitialLoading(true);
        setError("");
        const [prov, vars, regs] = await Promise.all([
          fetchProviders(),
          fetchVariables(),
          fetchRegions(),
        ]);

        setProviders(prov || []);
        setVariables(vars || []);
        setRegions(regs || []);

        // Set sensible defaults if not already chosen
        if (!provider && prov && prov.length > 0) {
          setProvider(prov[0]);
        }
        if (!variable && vars && vars.length > 0) {
          setVariable(vars[0]);
        }
        if (!region && regs && regs.length > 0) {
          setRegion(regs[0]);
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
        setError("Failed to load providers / variables / regions from API.");
      } finally {
        setInitialLoading(false);
      }
    }

    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch dataset rows whenever the selection changes
  useEffect(() => {
    if (!provider || !variable || !region) {
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchDatasets({
          provider,
          variable,
          region,
          limit: 1000,
        });
        setRows(data || []);
      } catch (err) {
        console.error("Failed to load dataset rows", err);
        setError("Failed to load data from API.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [provider, variable, region]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded p-4 shadow-sm border dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-2">Explore Climate Scenarios</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Select a provider, variable, and region to explore time series data
          served from the FastAPI backend.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm mb-1">Provider</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={initialLoading || providers.length === 0}
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Variable</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              disabled={initialLoading || variables.length === 0}
            >
              {variables.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Region</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={initialLoading || regions.length === 0}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(initialLoading || loading) && (
          <p className="mt-3 text-sm text-slate-500">Loading data…</p>
        )}
        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      {/* Chart */}
      <ChartView data={rows} variable={variable} />

      {/* Raw data table */}
      <DataTable rows={rows} />
    </div>
  );
}
