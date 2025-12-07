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

  /** Load providers */
  useEffect(() => {
    async function loadProvidersList() {
      try {
        const prov = await fetchProviders();
        setProviders(prov);

        if (!provider && prov.length > 0) {
          setProvider(prov[0]); // auto select first provider
        }
      } catch (err) {
        console.error(err);
        setError("Failed loading providers");
      }
    }
    loadProvidersList();
  }, []);

  /** Load variables & regions when provider changes */
  useEffect(() => {
    if (!provider) return;

    async function loadFilters() {
      try {
        const [vars, regs] = await Promise.all([
          fetchVariables(provider),
          fetchRegions(provider),
        ]);

        setVariables(vars);
        setRegions(regs);

        if (!variable && vars.length > 0) {
          setVariable(vars[0]);
        }
        if (!region && regs.length > 0) {
          setRegion(regs[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed loading variables/regions");
      } finally {
        setInitialLoading(false);
      }
    }

    loadFilters();
  }, [provider]);

  /** Load datasets */
  useEffect(() => {
    if (!provider || !variable || !region) return;

    async function loadData() {
      try {
        setLoading(true);

        const data = await fetchDatasets({
          provider,
          variable,
          region,
          limit: 1000,
        });

        setRows(data);
      } catch (err) {
        console.error(err);
        setError("Failed loading dataset");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [provider, variable, region]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded p-4 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Provider */}
          <div>
            <label>Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setVariable("");
                setRegion("");
              }}
              className="w-full rounded border p-2"
            >
              {providers.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Variables (provider-filtered) */}
          <div>
            <label>Variable</label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full rounded border p-2"
            >
              {variables.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Regions (provider-filtered) */}
          <div>
            <label>Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded border p-2"
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      <ChartView data={rows} variable={variable} />
      <DataTable rows={rows} />
    </div>
  );
}
