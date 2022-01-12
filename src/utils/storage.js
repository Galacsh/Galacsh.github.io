const storageAvailable = type => {
  var storage
  if (typeof window === "undefined") return false
  try {
    storage = window[type]
    var x = "__storage_test__"
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // Firefox를 제외한 모든 브라우저
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // 코드가 존재하지 않을 수도 있기 떄문에 이름 필드도 확인합니다.
        // Firefox를 제외한 모든 브라우저
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // 이미 저장된 것이있는 경우에만 QuotaExceededError를 확인하십시오.
      storage &&
      storage.length !== 0
    )
  }
}

export const storeItem = (key, obj) => {
  if (storageAvailable("localStorage")) {
    window.localStorage.setItem(key, JSON.stringify(obj))
  }
}

export const getStoredItem = key => {
  if (storageAvailable("localStorage")) {
    let val = window.localStorage.getItem(key)
    return JSON.parse(val)
  } else return null
}
