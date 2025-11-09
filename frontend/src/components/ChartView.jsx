import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";
const Plot = createPlotlyComponent(Plotly);

export default function ChartView({ data, variable }) {
  const years = data.map((d) => d.year);
  const values = data.map((d) => d.value);
  const title = variable || (data[0] && data[0].variable) || "Value";

  return (
    <div className="bg-white dark:bg-slate-800 rounded p-4 shadow-sm border dark:border-slate-700">
      <h4 className="font-semibold mb-2">{title} — Trend</h4>
      <Plot
        data={[
          {
            x: years,
            y: values,
            type: "scatter",
            mode: "lines+markers",
            marker: { size: 6 },
          },
        ]}
        layout={{
          autosize: true,
          margin: { t: 30, b: 40, l: 40, r: 20 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        style={{ width: "100%", height: "360px" }}
      />
    </div>
  );
}
