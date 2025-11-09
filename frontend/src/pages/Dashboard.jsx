import React, {useState, useEffect} from 'react'
import ChartView from '../components/ChartView'
import DataTable from '../components/DataTable'
import mock from '../data/mock_data.json'

export default function Dashboard(){
  const [provider, setProvider] = useState('IPCC')
  const [variable, setVariable] = useState('CO2 Emissions')
  const [region, setRegion] = useState('Global')
  const [rows, setRows] = useState([])

  useEffect(()=>{
    const ds = mock.datasets.filter(d=>d.provider===provider && d.variable===variable && d.region===region)
    setRows(ds)
  }, [provider, variable, region])

  return (
    <div className='space-y-4'>
      <div className='grid md:grid-cols-2 gap-4'>
        <ChartView data={rows} variable={variable} />
        <div className='bg-white dark:bg-slate-800 rounded p-4 border dark:border-slate-700'>
          <h4 className='font-semibold mb-2'>Quick Controls</h4>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm mb-1'>Provider</label>
              <select value={provider} onChange={e=>setProvider(e.target.value)} className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
                <option>IPCC</option>
                <option>IEA</option>
              </select>
            </div>
            <div>
              <label className='block text-sm mb-1'>Variable</label>
              <select value={variable} onChange={e=>setVariable(e.target.value)} className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
                <option>CO2 Emissions</option>
                <option>Energy Demand</option>
              </select>
            </div>
            <div>
              <label className='block text-sm mb-1'>Region</label>
              <select value={region} onChange={e=>setRegion(e.target.value)} className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
                <option>Global</option>
                <option>Europe</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <DataTable rows={rows} />
    </div>
  )
}
