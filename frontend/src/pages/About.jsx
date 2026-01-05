import React from "react";

export default function About() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">About &amp; Methodology</h3>
      <p>
        This prototype demonstrates a modular frontend for a climate data
        explorer. It is now connected to a FastAPI backend that serves
        harmonised time-series data derived from the IPCC R6 Excel source.
      </p>
      <ul className="list-disc ml-6">
        <li>Explore scenario data by provider, variable and region.</li>
        <li>Compare trends across different variables.</li>
        <li>Inspect the underlying dataset in a tabular repository view.</li>
      </ul>
      <p className="text-sm">
        The backend loads the original wide-format Excel file, converts it to a
        long-format table and exposes typed JSON responses. The frontend
        consumes these APIs using React and Plotly for interactive charts.
        Future extensions could add additional providers (e.g. NGFS) and
        export/reporting features.
      </p>

      <n />

      <p>
        For more detailed information, please{" "}
        <a
          href="https://github.com/Avinashluhana/interactive-climate-explorer-backpack/blob/main/Dataset/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          click here
        </a>
        .
      </p>
    </div>
  );
}
