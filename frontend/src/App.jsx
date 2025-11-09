import React, {useState, useEffect} from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Compare from './pages/Compare'
import DataRepo from './pages/DataRepo'
import About from './pages/About'
import { Sun, Moon } from 'lucide-react'

function App(){
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme==='dark')
    localStorage.setItem('theme', theme)
  },[theme])

  return (
    <div className='min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
      <header className='flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-r from-sky-500 to-emerald-400 text-white font-bold px-3 py-1 rounded'>Climate Explorer</div>
          <nav className='hidden md:flex gap-4 ml-4'>
            <Link to='/' className='hover:underline'>Dashboard</Link>
            <Link to='/compare' className='hover:underline'>Compare</Link>
            <Link to='/data' className='hover:underline'>Data Repo</Link>
            <Link to='/about' className='hover:underline'>About</Link>
          </nav>
        </div>
        <div className='flex items-center gap-3'>
          <button className='px-3 py-1 rounded border' onClick={()=>setTheme(theme==='dark'?'light':'dark')}>
            {theme==='dark'? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>
      </header>

      <div className='flex'>
        <aside className='w-64 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:block'>
          <h3 className='font-semibold mb-3'>Controls</h3>
          <div className='mb-3'>
            <label className='block text-sm mb-1'>Provider</label>
            <select id='provider-select' className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
              <option>IPCC</option>
              <option>IEA</option>
            </select>
          </div>
          <div className='mb-3'>
            <label className='block text-sm mb-1'>Variable</label>
            <select id='variable-select' className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
              <option>CO2 Emissions</option>
              <option>Energy Demand</option>
            </select>
          </div>
          <div className='mb-3'>
            <label className='block text-sm mb-1'>Region</label>
            <select id='region-select' className='w-full rounded border p-2 bg-white dark:bg-slate-800'>
              <option>Global</option>
              <option>Europe</option>
            </select>
          </div>
        </aside>

        <main className='flex-1 p-6'>
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/compare' element={<Compare/>} />
            <Route path='/data' element={<DataRepo/>} />
            <Route path='/about' element={<About/>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
