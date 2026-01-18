import React from "react";

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h3 className="text-xl font-semibold">About the Climate Scenario Explorer</h3>

      <p>
        The <strong>Interactive Climate Scenario Explorer</strong> is a web-based
        visualization platform designed to explore, compare, and analyze
        long-term climate scenario data published by the IPCC and IIASA.
        The application integrates harmonised emissions and climate forcing
        datasets and presents them through an interactive frontend powered by React
        and a FastAPI backend.
      </p>

      <h4 className="text-lg font-semibold mt-4">Project Objective</h4>
      <p>
        The primary goal of this project is to provide a transparent and flexible
        interface for examining climate scenarios across different providers,
        socioeconomic pathways, regions, and emission variables. Users can explore
        historical and projected trajectories of greenhouse gases and aerosols,
        supporting climate research, education, and policy analysis.
      </p>

      <h4 className="text-lg font-semibold mt-4">Datasets Used</h4>

      <p>
        This platform currently integrates two major scenario families used in
        IPCC assessments:
      </p>

      <ul className="list-disc ml-6 space-y-1">
        <li>
          <strong>RCP 6.0 (Representative Concentration Pathway)</strong> – a
          medium-to-high emissions stabilization scenario used in IPCC AR5
          climate modeling.
        </li>
        <li>
          <strong>SSP CMIP6 Scenarios</strong> – the latest generation of
          Shared Socioeconomic Pathways used in IPCC AR6 and CMIP6 climate models.
        </li>
      </ul>

      <h4 className="text-lg font-semibold mt-4">RCP 6.0 Scenario</h4>
      <p>
        RCP 6.0 represents a stabilization pathway where radiative forcing reaches
        approximately <strong>6.0 W/m² by 2100</strong>. Emissions continue rising
        through much of the 21st century before stabilizing, reflecting limited
        climate policy intervention. This scenario typically results in
        <strong> 3–3.7°C </strong> of global warming by the end of the century.
      </p>

      <p>
        The dataset includes emissions of CO₂, CH₄, N₂O, Black Carbon, aerosols,
        energy system variables, population projections, and radiative forcing
        components.
      </p>

      <h4 className="text-lg font-semibold mt-4">SSP CMIP6 Scenarios</h4>
      <p>
        The SSP CMIP6 dataset represents modern IPCC AR6 scenarios that combine
        socioeconomic narratives with emissions pathways. These scenarios span a
        wide range of futures, from strong mitigation pathways (SSP1-1.9) to
        high-emission futures (SSP3-7.0, SSP5-8.5).
      </p>

      <p>
        Certain SSP pathways, such as <strong>SSP4-6.0</strong> and
        <strong> SSP3-7.0</strong>, are considered modern equivalents of RCP 6.0,
        but with updated modeling assumptions and improved regional detail.
      </p>

      <h4 className="text-lg font-semibold mt-4">Unified Backend Data Model</h4>
      <p>
        To enable seamless querying and visualization, all datasets are converted
        into a unified long-format schema within the backend. This allows consistent
        filtering by provider, scenario, region, variable, and year.
      </p>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Example unified record:
      </p>

      <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm overflow-x-auto">
{`IPCC, SSP4-6.0, Global, CO2 Emissions, 2030, 40.2, GtCO2`}
      </pre>

      <h4 className="text-lg font-semibold mt-4">Backend Architecture</h4>
      <ul className="list-disc ml-6 space-y-1">
        <li>FastAPI-based REST services</li>
        <li>In-memory cached Pandas dataframe for high performance</li>
        <li>Dynamic filtering by provider, scenario, region, and variable</li>
        <li>Typed JSON responses using Pydantic schemas</li>
      </ul>

      <h4 className="text-lg font-semibold mt-4">Frontend Architecture</h4>
      <ul className="list-disc ml-6 space-y-1">
        <li>React-based modular UI</li>
        <li>Dynamic dropdowns linked to backend filters</li>
        <li>Interactive time-series charts</li>
        <li>Comparison views for multi-scenario analysis</li>
      </ul>

      <h4 className="text-lg font-semibold mt-4">Licensing & Data Sources</h4>
      <p>
        All datasets are sourced from official IIASA and IPCC repositories and
        are typically distributed under the
        <strong> Creative Commons CC-BY-4.0</strong> license.
        Users should verify variable-level metadata before commercial use.
      </p>

      <p className="mt-4">
        For full dataset documentation, variable definitions, and source links,
        please refer to the complete README:
      </p>

      <a
        href="https://github.com/Avinashluhana/interactive-climate-explorer-backpack/blob/main/Dataset/README.md"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View Dataset Documentation on GitHub
      </a>
    </div>
  );
}
