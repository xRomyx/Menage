const DAYS = [
  { key: 'lundi',    short: 'Lun' },
  { key: 'mardi',    short: 'Mar' },
  { key: 'mercredi', short: 'Mer' },
  { key: 'jeudi',    short: 'Jeu' },
  { key: 'vendredi', short: 'Ven' },
  { key: 'samedi',   short: 'Sam' },
  { key: 'dimanche', short: 'Dim' },
]

const CAT_COLORS = {
  'Cuisine': '#f97316',
  'Salle de bain': '#06b6d4',
  'Chambre': '#8b5cf6',
  'Salon': '#ec4899',
  'Extérieur': '#22c55e',
  'Général': '#6366f1',
}

function isToday(weekStart, dayIndex) {
  const today = new Date()
  const [y, m, d] = weekStart.split('-').map(Number)
  const check = new Date(y, m - 1, d + dayIndex)
  return check.toDateString() === today.toDateString()
}

export default function WeeklyPlanner({ tasks, planning, weekStart, onToggle, onDistribute }) {
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]))

  if (!planning) {
    return (
      <section className="planner planner-empty">
        <div className="planner-empty-content">
          <div className="planner-empty-icon">📅</div>
          <p className="planner-empty-text">Aucun planning pour cette semaine</p>
          <button
            className="btn-primary btn-large"
            onClick={onDistribute}
            disabled={tasks.length === 0}
          >
            Répartir la semaine
          </button>
          {tasks.length === 0 && (
            <p className="planner-hint">Ajoutez d'abord des tâches dans le panneau gauche.</p>
          )}
        </div>
      </section>
    )
  }

  const allTaskIds = Object.values(planning.days || {}).flat()
  const completedCount = allTaskIds.filter(id => {
    const day = Object.keys(planning.days).find(d => planning.days[d].includes(id))
    return !!planning.completed?.[`${id}_${day}`]
  }).length

  return (
    <section className="planner">
      {allTaskIds.length > 0 && (
        <div className="planner-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedCount / allTaskIds.length) * 100}%` }}
            />
          </div>
          <span className="progress-label">{completedCount}/{allTaskIds.length} tâches accomplies</span>
        </div>
      )}

      <div className="planner-grid">
        {DAYS.map((day, index) => {
          const dayTaskIds = planning.days?.[day.key] || []
          const dayTasks = dayTaskIds.map(id => taskMap[id]).filter(Boolean)
          const today = isToday(weekStart, index)
          const doneCount = dayTasks.filter(t => !!planning.completed?.[`${t.id}_${day.key}`]).length

          return (
            <div key={day.key} className={`day-col${today ? ' day-today' : ''}`}>
              <div className="day-head">
                <span className="day-name">{day.short}</span>
                {today && <span className="today-chip">Auj.</span>}
                {dayTasks.length > 0 && (
                  <span className="day-count">{doneCount}/{dayTasks.length}</span>
                )}
              </div>

              <ul className="day-tasks">
                {dayTasks.length === 0 ? (
                  <li className="day-empty">—</li>
                ) : (
                  dayTasks.map(task => {
                    const done = !!planning.completed?.[`${task.id}_${day.key}`]
                    const color = CAT_COLORS[task.category] || '#6366f1'
                    return (
                      <li
                        key={task.id}
                        className={`day-task${done ? ' done' : ''}`}
                        style={{ borderLeftColor: color }}
                        onClick={() => onToggle(task.id, day.key)}
                      >
                        <span
                          className="check-circle"
                          style={done ? { borderColor: color, background: color } : {}}
                        >
                          {done ? '✓' : ''}
                        </span>
                        <span className="day-task-name">{task.name}</span>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
