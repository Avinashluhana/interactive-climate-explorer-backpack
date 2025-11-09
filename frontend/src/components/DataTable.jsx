import React from 'react'

export default function DataTable({rows}){
  return (
    <div className='mt-4 bg-white dark:bg-slate-800 rounded p-3 border dark:border-slate-700'>
      <h4 className='font-semibold mb-2'>Data Table</h4>
      <div className='overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='pb-2 pr-4'>Provider</th>
              <th className='pb-2 pr-4'>Scenario</th>
              <th className='pb-2 pr-4'>Region</th>
              <th className='pb-2 pr-4'>Variable</th>
              <th className='pb-2 pr-4'>Year</th>
              <th className='pb-2 pr-4'>Value</th>
              <th className='pb-2 pr-4'>Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx)=>(
              <tr key={idx} className='border-t border-slate-100 dark:border-slate-700'>
                <td className='py-2 pr-4'>{r.provider}</td>
                <td className='py-2 pr-4'>{r.scenario}</td>
                <td className='py-2 pr-4'>{r.region}</td>
                <td className='py-2 pr-4'>{r.variable}</td>
                <td className='py-2 pr-4'>{r.year}</td>
                <td className='py-2 pr-4'>{r.value}</td>
                <td className='py-2 pr-4'>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
