import React, { useEffect, useState } from "react";
import ChartView from "../components/ChartView";
import {
  fetchProviders,
  fetchScenarios,
  fetchVariables,
  fetchRegions,
  fetchDatasets,
} from "../api";

export default function Compare() {
  /* ---------- SHARED OPTIONS ---------- */
  const [providers, setProviders] = useState([]);

  /* ---------- GRAPH A STATE ---------- */
  const [providerA, setProviderA] = useState("");
  const [scenarioA, setScenarioA] = useState("");
  const [regionA, setRegionA] = useState("");
  const [variableA, setVariableA] = useState("");

  const [scenariosA, setScenariosA] = useState([]);
  const [regionsA, setRegionsA] = useState([]);
  const [variablesA, setVariablesA] = useState([]);
  const [seriesA, setSeriesA] = useState([]);

  /* ---------- GRAPH B STATE ---------- */
  const [providerB, setProviderB] = useState("");
  const [scenarioB, setScenarioB] = useState("");
  const [regionB, setRegionB] = useState("");
  const [variableB, setVariableB] = useState("");

  const [scenariosB, setScenariosB] = useState([]);
  const [regionsB, setRegionsB] = useState([]);
  const [variablesB, setVariablesB] = useState([]);
  const [seriesB, setSeriesB] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOAD PROVIDERS ---------- */
  useEffect(() => {
    async function loadProviders() {
      const data = await fetchProviders();
      setProviders(data || []);
      setProviderA(data?.[0] || "");
      setProviderB(data?.[0] || "");
    }
    loadProviders();
  }, []);

  /* ---------- HELPERS ---------- */
  async function loadScenarios(provider, setScenarios, setScenario) {
    const data = await fetchScenarios(provider);
    setScenarios(data || []);
    setScenario(data?.[0] || "");
  }

  async function loadVarsRegions(
    provider,
    scenario,
    setVars,
    setRegs,
    setVar,
    setReg,
  ) {
    const [vars, regs] = await Promise.all([
      fetchVariables(provider, scenario),
      fetchRegions(provider, scenario),
    ]);
    setVars(vars || []);
    setRegs(regs || []);
    setVar(vars?.[0] || "");
    setReg(regs?.[0] || "");
  }

  /* ---------- GRAPH A FLOW ---------- */
  useEffect(() => {
    if (!providerA) return;
    loadScenarios(providerA, setScenariosA, setScenarioA);
  }, [providerA]);

  useEffect(() => {
    if (!providerA || !scenarioA) return;
    loadVarsRegions(
      providerA,
      scenarioA,
      setVariablesA,
      setRegionsA,
      setVariableA,
      setRegionA,
    );
  }, [providerA, scenarioA]);

  useEffect(() => {
    if (!providerA || !scenarioA || !regionA || !variableA) return;
    fetchDatasets({
      provider: providerA,
      scenario: scenarioA,
      region: regionA,
      variable: variableA,
    })
      .then(setSeriesA)
      .catch(() => setSeriesA([]));
  }, [providerA, scenarioA, regionA, variableA]);

  /* ---------- GRAPH B FLOW ---------- */
  useEffect(() => {
    if (!providerB) return;
    loadScenarios(providerB, setScenariosB, setScenarioB);
  }, [providerB]);

  useEffect(() => {
    if (!providerB || !scenarioB) return;
    loadVarsRegions(
      providerB,
      scenarioB,
      setVariablesB,
      setRegionsB,
      setVariableB,
      setRegionB,
    );
  }, [providerB, scenarioB]);

  useEffect(() => {
    if (!providerB || !scenarioB || !regionB || !variableB) return;
    fetchDatasets({
      provider: providerB,
      scenario: scenarioB,
      region: regionB,
      variable: variableB,
    })
      .then(setSeriesB)
      .catch(() => setSeriesB([]));
  }, [providerB, scenarioB, regionB, variableB]);

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Compare Climate Scenarios</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* -------- GRAPH A -------- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
          <h4 className="font-semibold mb-3">Scenario A</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Select
              label="Model"
              value={providerA}
              set={setProviderA}
              options={providers}
            />
            <Select
              label="Scenario"
              value={scenarioA}
              set={setScenarioA}
              options={scenariosA}
            />
            <Select
              label="Region"
              value={regionA}
              set={setRegionA}
              options={regionsA}
            />
            <Select
              label="Variable"
              value={variableA}
              set={setVariableA}
              options={variablesA}
            />
          </div>
          <ChartView data={seriesA} variable={variableA} />
        </div>

        {/* -------- GRAPH B -------- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
          <h4 className="font-semibold mb-3">Scenario B</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Select
              label="Model"
              value={providerB}
              set={setProviderB}
              options={providers}
            />
            <Select
              label="Scenario"
              value={scenarioB}
              set={setScenarioB}
              options={scenariosB}
            />
            <Select
              label="Region"
              value={regionB}
              set={setRegionB}
              options={regionsB}
            />
            <Select
              label="Variable"
              value={variableB}
              set={setVariableB}
              options={variablesB}
            />
          </div>
          <ChartView data={seriesB} variable={variableB} />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

/* ---------- REUSABLE SELECT ---------- */
function Select({ label, value, set, options }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        className="w-full rounded border p-2 bg-white dark:bg-slate-800"
        value={value}
        onChange={(e) => set(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
