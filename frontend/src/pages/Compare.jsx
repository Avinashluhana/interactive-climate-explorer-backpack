import React from "react";
import ChartView from "../components/ChartView";
import mock from "../data/mock_data.json";

export default function Compare() {
  const ipcc = mock.datasets.filter(
    (d) => d.provider === "IPCC" && d.variable === "CO2 Emissions"
  );
  const iea = mock.datasets.filter(
    (d) => d.provider === "IEA" && d.variable === "Energy Demand"
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        This section will be added in the next phase.
      </h3>
    </div>
  );
}
