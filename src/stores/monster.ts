import { defineStore } from 'pinia';

interface MonsterState {
  monster: number;
}

export const useMonsterStore = defineStore('monster', {
  state: (): MonsterState => ({
    monster: 0,
  }),
  actions: {
    setMonster(monster: number) {
      this.monster = monster;
    },
  },
});
