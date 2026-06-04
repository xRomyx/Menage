import { useState } from 'react'

const CATEGORIES = ['Cuisine', 'Salle de bain', 'Chambre', 'Salon', 'Extérieur', 'Général']

const FREQ_OPTIONS = [
  { value: 1, label: '1× par semaine' },
  { value: 2, label: '2× par semaine' },
  { value: 3, label: '3× par semaine' },
  { value: 4, label: '4× par semaine' },
  { value: 5, label: '5× par semaine' },
  { value: 6, label: '6× par semaine' },
  { value: 7, label: 'Chaque jour' },
]

export default function TaskForm({ task, onSave, onCancel }) {
  const [name, setName] = useState(task?.name || '')
  const [frequency, setFrequency] = useState(task?.frequency || 1)
  const [category, setCategory] = useState(task?.category || 'Général')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), frequency: Number(frequency), category })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom de la tâche</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Passer l'aspirateur"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fréquence</label>
            <select className="form-select" value={frequency} onChange={e => setFrequency(e.target.value)}>
              {FREQ_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
            <button type="submit" className="btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}
