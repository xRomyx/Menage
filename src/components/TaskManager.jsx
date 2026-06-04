import { useState } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import TaskForm from './TaskForm'

const FREQ_LABELS = ['', '1×/sem', '2×/sem', '3×/sem', '4×/sem', '5×/sem', '6×/sem', 'Quotidien']

const CAT_COLORS = {
  'Cuisine': '#f97316',
  'Salle de bain': '#06b6d4',
  'Chambre': '#8b5cf6',
  'Salon': '#ec4899',
  'Extérieur': '#22c55e',
  'Général': '#6366f1',
}

export default function TaskManager({ tasks }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleSave = async (data) => {
    if (editing) {
      await updateDoc(doc(db, 'tasks', editing.id), data)
    } else {
      await addDoc(collection(db, 'tasks'), data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (task) => {
    setEditing(task)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette tâche ?')) {
      await deleteDoc(doc(db, 'tasks', id))
    }
  }

  const openAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  return (
    <aside className="task-manager">
      <div className="panel-header">
        <h2 className="panel-title">Tâches</h2>
        <button className="btn-add" onClick={openAdd}>+ Ajouter</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Aucune tâche pour l'instant.</p>
          <p>Cliquez sur <strong>+ Ajouter</strong> pour commencer.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <span className="task-name">{task.name}</span>
                <div className="task-badges">
                  <span className="badge badge-freq">
                    {FREQ_LABELS[task.frequency] ?? `${task.frequency}×`}
                  </span>
                  {task.category && (
                    <span
                      className="badge badge-cat"
                      style={{
                        background: (CAT_COLORS[task.category] || '#6366f1') + '22',
                        color: CAT_COLORS[task.category] || '#6366f1',
                      }}
                    >
                      {task.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-icon-sm" onClick={() => handleEdit(task)} title="Modifier">✏️</button>
                <button className="btn-icon-sm" onClick={() => handleDelete(task.id)} title="Supprimer">🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <TaskForm
          task={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </aside>
  )
}
