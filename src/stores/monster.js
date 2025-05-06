import { defineStore } from 'pinia'

export const useMonsterStore = defineStore('monster', {
    // 화살표 함수는 객체 반환시 소괄호 사용 (= return기능)
    state: () => ({
        monster: 0,
    }),
    // getters: {
    //     doubleCount: state => state.counter * 2,
    // },
    actions: {
        setMonster(monster) {
            this.monster = monster
        },
    },
})