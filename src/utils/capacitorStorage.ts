import { Preferences } from '@capacitor/preferences'

export const CapacitorStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await Preferences.set({
        key: 'SMW-Authorization',
        value: token
      })
    } catch (error) {
      console.error('토큰 저장 실패:', error)
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: 'SMW-Authorization' })
      return result.value
    } catch (error) {
      console.error('토큰 불러오기 실패:', error)
      return null
    }
  },

  async removeToken(): Promise<void> {
    try {
      await Preferences.remove({ key: 'SMW-Authorization' })
    } catch (error) {
      console.error('토큰 삭제 실패:', error)
    }
  }
}
