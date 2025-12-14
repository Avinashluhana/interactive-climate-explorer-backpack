import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/** Providers */
export async function fetchProviders() {
  const res = await api.get("/providers");
  return res.data;
}

/** Scenarios — filtered by provider */
export async function fetchScenarios(provider) {
  const res = await api.get("/scenarios", {
    params: provider ? { provider } : {},
  });
  return res.data;
}

/** Variables — filtered by provider + scenario */
export async function fetchVariables(provider, scenario) {
  const res = await api.get("/variables", {
    params: {
      ...(provider && { provider }),
      ...(scenario && { scenario }),
    },
  });
  return res.data;
}

/** Regions — filtered by provider + scenario */
export async function fetchRegions(provider, scenario) {
  const res = await api.get("/regions", {
    params: {
      ...(provider && { provider }),
      ...(scenario && { scenario }),
    },
  });
  return res.data;
}

/** Dataset rows */
export async function fetchDatasets(params = {}) {
  const res = await api.get("/datasets", { params });
  return res.data;
}
