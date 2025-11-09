import React from 'react'

export default function About(){
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>About & Methodology</h3>
      <p>This prototype demonstrates a modular frontend for the Climate Data Explorer. It uses mock datasets and provides functionality to:</p>
      <ul className='list-disc ml-6'>
        <li>Explore scenario data by provider, variable, and region.</li>
        <li>Compare trends across scenarios.</li>
        <li>Inspect dataset provenance and licensing.</li>
      </ul>
      <p className='text-sm'>Next steps: connect to FastAPI backend, add more datasets (NGFS), and implement export/reporting.</p>
    </div>
  )
}
