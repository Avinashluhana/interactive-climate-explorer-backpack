import React, { useEffect, useState } from "react";
import ChartView from "../components/ChartView";
import DataTable from "../components/DataTable";
import {
  fetchProviders,
  fetchScenarios,
  fetchVariables,
  fetchRegions,
  fetchDatasets,
} from "../api";

export default function Dashboard() {
  const [providers, setProviders] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [variables, setVariables] = useState([]);
  const [regions, setRegions] = useState([]);

  const [provider, setProvider] = useState("");
  const [scenario, setScenario] = useState("");
  const [variable, setVariable] = useState("");
  const [region, setRegion] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Providers */
  useEffect(() => {
    fetchProviders().then((p) => {
      setProviders(p);
      setProvider(p?.[0] || "");
    });
  }, []);

  /* Scenarios */
  useEffect(() => {
    if (!provider) return;
    fetchScenarios(provider).then((s) => {
      setScenarios(s);
      setScenario(s?.[0] || "");
    });
  }, [provider]);

  /* Variables & Regions */
  useEffect(() => {
    if (!provider || !scenario) return;

    Promise.all([
      fetchVariables(provider, scenario),
      fetchRegions(provider, scenario),
    ]).then(([v, r]) => {
      setVariables(v);
      setRegions(r);
      setVariable(v?.[0] || "");
      setRegion(r?.[0] || "");
    });
  }, [provider, scenario]);

  /* Data */
  useEffect(() => {
    if (!provider || !scenario || !variable || !region) return;

    setLoading(true);
    fetchDatasets({ provider, scenario, variable, region, limit: 1000 })
      .then(setRows)
      .finally(() => setLoading(false));
  }, [provider, scenario, variable, region]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded p-4 border shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Explore Climate Scenarios</h3>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Provider", provider, setProvider, providers],
            ["Scenario", scenario, setScenario, scenarios],
            ["Variable", variable, setVariable, variables],
            ["Region", region, setRegion, regions],
          ].map(([label, value, setter, options]) => (
            <div key={label}>
              <label className="block text-sm mb-1">{label}</label>
              <select
                className="w-full rounded border p-2 bg-white dark:bg-slate-800"
                value={value}
                onChange={(e) => setter(e.target.value)}
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {loading && <p className="mt-3 text-sm">Loading…</p>}
      </div>

      <ChartView data={rows} variable={variable} />
      <DataTable rows={rows} />
    </div>
  );
}
