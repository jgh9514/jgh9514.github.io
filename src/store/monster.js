export const state = () => ({
    monster: [],
})
export const mutations = {
    setMonster: (state, monster) => {
        state.monster = monster
    },
}
export const getters = {
    getMonster: (state) => {
        return state.monster
    },
}