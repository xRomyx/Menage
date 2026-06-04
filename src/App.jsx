import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import TaskManager from './components/TaskManager'
import WeeklyPlanner from './components/WeeklyPlanner'
import { distribute } from './utils/distribute'
import './App.css'

function getWeekStart(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset * 7)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function formatWeekLabel(weekStart) {
  const [y, m, d] = weekStart.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const end = new Date(y, m - 1, d + 6)
  const opts = { day: 'numeric', month: 'long' }
  return `${start.toLocaleDateString('fr-FR', opts)} – ${end.toLocaleDateString('fr-FR', opts)}`
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [planning, setPlanning] = useState(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  const weekStart = getWeekStart(weekOffset)

  useEffect(() => {
    return onSnapshot(collection(db, 'tasks'), snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    return onSnapshot(doc(db, 'planning', weekStart), snap => {
      setPlanning(snap.exists() ? snap.data() : null)
    })
  }, [weekStart])

  const handleDistribute = async () => {
    if (planning && !window.confirm('Remplacer le planning actuel ? Les tâches cochées seront réinitialisées.')) return
    const days = distribute(tasks)
    await setDoc(doc(db, 'planning', weekStart), { weekStart, days, completed: {} })
  }

  const handleToggle = async (taskId, day) => {
    if (!planning) return
    const key = `${taskId}_${day}`
    const completed = { ...planning.completed, [key]: !planning.completed?.[key] }
    await setDoc(doc(db, 'planning', weekStart), { ...planning, completed })
  }

  if (loading) return <div className="loading">Chargement…</div>

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">Tâches ménagères</h1>
          <div className="week-nav">
            <button className="btn-nav" onClick={() => setWeekOffset(w => w - 1)}>‹</button>
            <span className="week-label">{formatWeekLabel(weekStart)}</span>
            <button className="btn-nav" onClick={() => setWeekOffset(w => w + 1)}>›</button>
            {weekOffset !== 0 && (
              <button className="btn-today" onClick={() => setWeekOffset(0)}>Aujourd'hui</button>
            )}
          </div>
        </div>
        <button className="btn-primary" onClick={handleDistribute} disabled={tasks.length === 0}>
          Répartir la semaine
        </button>
      </header>

      <main className="main">
        <TaskManager tasks={tasks} />
        <WeeklyPlanner
          tasks={tasks}
          planning={planning}
          weekStart={weekStart}
          onToggle={handleToggle}
          onDistribute={handleDistribute}
        />
      </main>
    </div>
  )
}
