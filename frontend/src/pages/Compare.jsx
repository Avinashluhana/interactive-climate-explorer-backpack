import React, { useEffect, useState } from "react";
import ChartView from "../components/ChartView";
import {
  fetchProviders,
  fetchVariables,
  fetchRegions,
  fetchDatasets,
} from "../api";

export default function Compare() {
  const [providers, setProviders] = useState([]);
  const [variables, setVariables] = useState([]);
  const [regions, setRegions] = useState([]);

  const [provider, setProvider] = useState("");
  const [region, setRegion] = useState("");
  const [variableA, setVariableA] = useState("");
  const [variableB, setVariableB] = useState("");

  const [seriesA, setSeriesA] = useState([]);
  const [seriesB, setSeriesB] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load filter options
  useEffect(() => {
    async function loadOptions() {
      try {
        setError("");
        const [prov, vars, regs] = await Promise.all([
          fetchProviders(),
          fetchVariables(),
          fetchRegions(),
        ]);
        setProviders(prov || []);
        setVariables(vars || []);
        setRegions(regs || []);

        if (!provider && prov && prov.length > 0) {
          setProvider(prov[0]);
        }
        if (!region && regs && regs.length > 0) {
          setRegion(regs[0]);
        }
        if (!variableA && vars && vars.length > 0) {
          setVariableA(vars[0]);
        }
        if (!variableB && vars && vars.length > 1) {
          setVariableB(vars[1]);
        }
      } catch (err) {
        console.error("Failed to load compare options", err);
        setError("Failed to load options from API.");
      }
    }
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the two series when selection changes
  useEffect(() => {
    if (!provider || !region || !variableA || !variableB) {
      return;
    }

    async function loadSeries() {
      try {
        setLoading(true);
        setError("");
        const [a, b] = await Promise.all([
          fetchDatasets({ provider, region, variable: variableA, limit: 1000 }),
          fetchDatasets({ provider, region, variable: variableB, limit: 1000 }),
        ]);
        setSeriesA(a || []);
        setSeriesB(b || []);
      } catch (err) {
        console.error("Failed to load compare series", err);
        setError("Failed to load comparison data from API.");
        setSeriesA([]);
        setSeriesB([]);
      } finally {
        setLoading(false);
      }
    }

    loadSeries();
  }, [provider, region, variableA, variableB]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded p-4 shadow-sm border dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-2">Compare Variables</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Compare two different variables for the same provider and region
          using data served from the FastAPI backend.
        </p>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm mb-1">Provider</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
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
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Variable A</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={variableA}
              onChange={(e) => setVariableA(e.target.value)}
            >
              {variables.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Variable B</label>
            <select
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={variableB}
              onChange={(e) => setVariableB(e.target.value)}
            >
              {variables.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <p className="mt-3 text-sm text-slate-500">Loading comparison…</p>
        )}
        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="font-semibold mb-2">
            {variableA || "Variable A"} — {region}
          </h4>
          <ChartView data={seriesA} variable={variableA} />
        </div>
        <div>
          <h4 className="font-semibold mb-2">
            {variableB || "Variable B"} — {region}
          </h4>
          <ChartView data={seriesB} variable={variableB} />
        </div>
      </div>
    </div>
  );
}
