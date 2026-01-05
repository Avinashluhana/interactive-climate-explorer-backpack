import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import DataRepo from "./pages/DataRepo";
import About from "./pages/About";
import { Sun, Moon, HelpCircle } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // --- dropdown data ---
  const [providers, setProviders] = useState([]);
  const [variables, setVariables] = useState([]);
  const [regions, setRegions] = useState([]);

  // --- selected values ---
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // ---------------- THEME ----------------
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---------------- LOAD PROVIDERS ----------------
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch(`${API_BASE}/providers`);
        const data = await res.json(); // expects: ["IPCC-R6", ...]
        setProviders(data || []);
        if (!selectedProvider && data && data.length > 0) {
          setSelectedProvider(data[0]);
        }
      } catch (err) {
        console.error("Error loading providers:", err);
      }
    }
    loadProviders();
  }, []); // run once

  // ---------------- LOAD VARIABLES WHEN PROVIDER CHANGES ----------------
  useEffect(() => {
    if (!selectedProvider) return;

    async function loadVariables() {
      try {
        const res = await fetch(
          `${API_BASE}/variables?provider=${encodeURIComponent(
            selectedProvider
          )}`
        );
        const data = await res.json(); // expects: ["Concentration - CO2", ...]
        setVariables(data || []);
        if (!selectedVariable && data && data.length > 0) {
          setSelectedVariable(data[0]);
        }
      } catch (err) {
        console.error("Error loading variables:", err);
      }
    }
    loadVariables();
  }, [selectedProvider]);

  // ---------------- LOAD REGIONS WHEN PROVIDER CHANGES ----------------
  useEffect(() => {
    if (!selectedProvider) return;

    async function loadRegions() {
      try {
        const res = await fetch(
          `${API_BASE}/regions?provider=${encodeURIComponent(selectedProvider)}`
        );
        const data = await res.json(); // expects: ["World", "R5ASIA", ...]
        setRegions(data || []);
        if (!selectedRegion && data && data.length > 0) {
          setSelectedRegion(data[0]);
        }
      } catch (err) {
        console.error("Error loading regions:", err);
      }
    }
    loadRegions();
  }, [selectedProvider]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-sky-500 to-emerald-400 text-white font-bold px-3 py-1 rounded">
            Climate Explorer
          </div>

          <nav className="hidden md:flex gap-4 ml-4">
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/compare" className="hover:underline">
              Compare
            </Link>
            <Link to="/data" className="hover:underline">
              Data Repo
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>

        {/* Right: Help + Theme */}
        <div className="flex items-center gap-3">
          {/* Help / README button */}
          <a
            href="https://github.com/Avinashluhana/interactive-climate-explorer-backpack/blob/main/Dataset/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded border hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Project documentation"
            title="Documentation"
          >
            <HelpCircle size={18} />
          </a>

          {/* Theme toggle */}
          <button
            className="p-2 rounded border hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR CONTROLS */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:block">
          <h3 className="font-semibold mb-3">Controls</h3>

          {/* Provider */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Provider</label>
            <select
              id="provider-select"
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                // reset dependent selections
                setSelectedVariable("");
                setSelectedRegion("");
              }}
            >
              {providers.length === 0 && <option>Loading...</option>}
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Variable */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Variable</label>
            <select
              id="variable-select"
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
            >
              {variables.length === 0 && <option>Loading...</option>}
              {variables.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Region</label>
            <select
              id="region-select"
              className="w-full rounded border p-2 bg-white dark:bg-slate-800"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.length === 0 && <option>Loading...</option>}
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  provider={selectedProvider}
                  variable={selectedVariable}
                  region={selectedRegion}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <Compare
                  provider={selectedProvider}
                  variable={selectedVariable}
                  region={selectedRegion}
                />
              }
            />
            <Route
              path="/data"
              element={
                <DataRepo
                  provider={selectedProvider}
                  variable={selectedVariable}
                  region={selectedRegion}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
