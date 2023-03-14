export const StorageService = {
  getAccessToken() {
    return _localstorage.getItem('at')
  },
  setAccessToken(value: string) {
    return _localstorage.setItem('at', value)
  },
  getRefreshToken() {
    return _localstorage.getItem('rt')
  },
  setRefreshToken(value: string) {
    return _localstorage.setItem('rt', value)
  },
  get(key: string, fromSessionStorage = false) {
    return _localstorage.getItem(key, fromSessionStorage)
  },
  set(key: string, value: string, saveToSessionStorage = false) {
    return _localstorage.setItem(key, value, saveToSessionStorage)
  },
}

const _localstorage = {
  getItem(key: string, fromSessionStorage = false) {
    key = generateKey(key)
    const storage = selectStorage(fromSessionStorage)

    const val = storage.getItem(key)

    if (val === null) return undefined

    try {
      return JSON.parse(val)
    } catch (error) {
      return val // if not, simply return the value.
    }
  },

  setItem(key: string, value: string, saveToSessionStorage = false) {
    key = generateKey(key)
    const storage = selectStorage(saveToSessionStorage)

    if (value === undefined || value === null) {
      return storage.removeItem(key)
    }

    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }

    storage.setItem(key, value)
  },
}

function selectStorage(isSession = false) {
  return !isSession ? localStorage : sessionStorage
}

function generateKey(key: string) {
  return '__invoice-app__.' + key
}
