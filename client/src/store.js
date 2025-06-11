import create from 'zustand';
export const useStore = create(set => ({
  round: 1,
  score: { you: 0, opp: 0 },
  shooting: false,
  setRound: r => set({ round: r }),
  setScore: s => set({ score: s }),
  shoot: () => set({ shooting: true }),
  doneShoot: () => set({ shooting: false })
}));