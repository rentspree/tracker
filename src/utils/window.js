export function setLocalStorageItem(key, value) {
  window.localStorage[key] = value
}

export function getLocalStorageItem(itemName) {
  return window.localStorage.getItem(itemName)
}

export function removeLocalStorageItem(itemName) {
  window.localStorage.removeItem(itemName)
}
