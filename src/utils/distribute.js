const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export function distribute(tasks) {
  const days = Object.fromEntries(DAYS.map(d => [d, []]))
  const loads = Object.fromEntries(DAYS.map(d => [d, 0]))

  // Les tâches les plus fréquentes en premier pour une meilleure répartition
  const sorted = [...tasks].sort((a, b) => b.frequency - a.frequency)

  for (const task of sorted) {
    const freq = Math.min(Math.max(task.frequency || 1, 1), 7)

    // Trier les jours par charge croissante, aléatoire en cas d'égalité (variété chaque semaine)
    const ranked = [...DAYS].sort((a, b) => {
      const diff = loads[a] - loads[b]
      return diff !== 0 ? diff : Math.random() - 0.5
    })

    for (let i = 0; i < freq; i++) {
      days[ranked[i]].push(task.id)
      loads[ranked[i]]++
    }
  }

  return days
}
