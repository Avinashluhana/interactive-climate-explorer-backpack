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

  /** Load providers */
  useEffect(() => {
    async function loadProvidersList() {
      const prov = await fetchProviders();
      setProviders(prov);
      if (!provider && prov.length) setProvider(prov[0]);
    }
    loadProvidersList();
  }, []);

  /** Load variables + regions when provider changes */
  useEffect(() => {
    if (!provider) return;

    async function loadDepFilters() {
      try {
        const [vars, regs] = await Promise.all([
          fetchVariables(provider),
          fetchRegions(provider),
        ]);

        setVariables(vars);
        setRegions(regs);

        setVariableA(vars[0] || "");
        setVariableB(vars[1] || vars[0] || "");
        setRegion(regs[0] || "");
      } catch (err) {
        setError("Failed loading variables / regions");
      }
    }

    loadDepFilters();
  }, [provider]);

  /** Load datasets for A + B */
  useEffect(() => {
    if (!provider || !region || !variableA || !variableB) return;

    async function load() {
      setLoading(true);
      try {
        const [a, b] = await Promise.all([
          fetchDatasets({ provider, region, variable: variableA }),
          fetchDatasets({ provider, region, variable: variableB }),
        ]);

        setSeriesA(a);
        setSeriesB(b);
      } catch (err) {
        setError("Failed loading comparison data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [provider, region, variableA, variableB]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-slate-900 rounded">

        <div className="grid gap-4 md:grid-cols-4">

          {/* Provider */}
          <div>
            <label>Provider</label>
            <select
              className="w-full p-2 border rounded"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              {providers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Regions (filtered) */}
          <div>
            <label>Region</label>
            <select
              className="w-full p-2 border rounded"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Var A */}
          <div>
            <label>Variable A</label>
            <select
              className="w-full p-2 border rounded"
              value={variableA}
              onChange={(e) => setVariableA(e.target.value)}
            >
              {variables.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Var B */}
          <div>
            <label>Variable B</label>
            <select
              className="w-full p-2 border rounded"
              value={variableB}
              onChange={(e) => setVariableB(e.target.value)}
            >
              {variables.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartView data={seriesA} variable={variableA} />
        <ChartView data={seriesB} variable={variableB} />
      </div>
    </div>
  );
}
