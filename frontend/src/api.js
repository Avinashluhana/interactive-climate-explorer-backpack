import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Fetch list of providers from the backend.
 */
export async function fetchProviders() {
  const res = await api.get("/providers");
  return res.data;
}

/**
 * Fetch list of variables from the backend.
 */
export async function fetchVariables() {
  const res = await api.get("/variables");
  return res.data;
}

/**
 * Fetch list of regions from the backend.
 */
export async function fetchRegions() {
  const res = await api.get("/regions");
  return res.data;
}

/**
 * Fetch list of scenarios from the backend.
 */
export async function fetchScenarios() {
  const res = await api.get("/scenarios");
  return res.data;
}

/**
 * Fetch dataset rows with optional filters.
 * params: { provider?, variable?, region?, scenario?, start_year?, end_year?, limit? }
 */
export async function fetchDatasets(params = {}) {
  const res = await api.get("/datasets", {
    params,
  });
  return res.data;
}
