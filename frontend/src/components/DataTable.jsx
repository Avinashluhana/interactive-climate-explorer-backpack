import React, { useMemo, useState } from "react";

export default function DataTable({ rows }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(rows.length / pageSize);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  return (
    <div className="mt-4 bg-white dark:bg-slate-800 rounded p-3 border dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Data Table</h4>

        {/* Page size selector */}
        <select
          className="text-sm bg-transparent border rounded px-2 py-1 dark:border-slate-600"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-2 pr-4">Model</th>
              <th className="pb-2 pr-4">Scenario</th>
              <th className="pb-2 pr-4">Region</th>
              <th className="pb-2 pr-4">Variable</th>
              <th className="pb-2 pr-4">Year</th>
              <th className="pb-2 pr-4">Value</th>
              <th className="pb-2 pr-4">Unit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((r, idx) => (
              <tr
                key={idx}
                className="border-t border-slate-100 dark:border-slate-700"
              >
                <td className="py-2 pr-4">{r.provider}</td>
                <td className="py-2 pr-4">{r.scenario}</td>
                <td className="py-2 pr-4">{r.region}</td>
                <td className="py-2 pr-4">{r.variable}</td>
                <td className="py-2 pr-4">{r.year}</td>
                <td className="py-2 pr-4">{r.value}</td>
                <td className="py-2 pr-4">{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-slate-500">
          Page {page} of {totalPages}
        </span>

        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-slate-600"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-slate-600"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
