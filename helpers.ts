import _ from 'lodash'
import md5 from 'md5'

const deepClone = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => deepClone(item))
  } else if (typeof data === 'object' && data !== null) {
    let copy = {}
    for (let key in data) {
      // @ts-ignore
      copy[key] = deepClone(data[key])
    }
    return copy
  } else {
    return data
  }
}
const compare = (oldValue: any[] | object, newValue: any[] | object) => {
  const STATUS = {
    identical: true,
    stack: [] as any[],
  }
  const SORTED_DATA = {
    SAVED_DATA: Array.isArray(oldValue)
      ? oldValue.sort()
      : sortObject(oldValue),
    NEW_DATA: Array.isArray(newValue) ? newValue.sort() : sortObject(newValue),
  }
  const JSON_DATA = {
    SAVED_DATA: JSON.stringify(SORTED_DATA.SAVED_DATA),
    NEW_DATA: JSON.stringify(SORTED_DATA.NEW_DATA),
  }

  STATUS.identical = md5(JSON_DATA.SAVED_DATA) === md5(JSON_DATA.NEW_DATA)
  if (!STATUS.identical) {
    STATUS.stack = Array.isArray(oldValue)
      ? _.differenceWith(
          // @ts-ignore
          SORTED_DATA.SAVED_DATA,
          SORTED_DATA.NEW_DATA,
          _.isEqual,
        )
      : _.differenceWith(
          _.toPairs(SORTED_DATA.SAVED_DATA),
          _.toPairs(SORTED_DATA.NEW_DATA),
          _.isEqual,
        )
  }

  console.table({ SORTED_DATA, JSON_DATA, STATUS })

  return STATUS
}
const sortObject = (obj: any) => {
  return Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      // @ts-ignore
      result[key] = obj[key]
      return result
    }, {})
}

const scrollTo = (ctx: any) => {
  setTimeout(() => {
    window.scrollTo({
      top: ctx.offsetTop + ctx.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }, 100)
}
const dublicateItems = (
  key1: { array: any[]; key: string },
  key2: { array: any[]; key: string },
) => {
  return key1.array.filter((k1) => {
    return key2.array.find((k2) => {
      return k2[key2.key] === k1[key1.key]
    })
  })
}

const globalRules = {
  required: (value: any) => {
    if (!value) {
      return 'Field is required'
    }
  },
  min: (value: any, min: number) => {
    if (typeof value === 'string') {
      if (value.length < min) {
        return `Field must be greater than ${min} degits`
      }
    } else {
      if (value < min) {
        return `Field must be greater than ${min}`
      }
    }
  },
  max: (value: any, max: number) => {
    if (typeof value === 'string') {
      if (value.length > max) {
        return `Field must be less than ${max} degits`
      }
    } else {
      if (value > max) {
        return `Field must be less than ${max}`
      }
    }
  },
  isDegits(value: string) {
    let convVal = value ? value.trim() : value
    if (/\s/.test(convVal)) {
      return 'Field value should not contains spaces'
    }
    if (parseFloat(convVal) <= 0) {
      return 'Field value must be greater than 0'
    }
    if (!/^\d+$/.test(convVal)) {
      return 'Field value must be numbers'
    }
  },
}
const triggerRules = (rules: Array<string | undefined>) => {
  for (let i = 0; i < rules.length; i++) {
    if (rules[i]) {
      return rules[i]
      break // terminate the loop when i is equal to 5
    }
  }
}

export {
  deepClone,
  scrollTo,
  compare,
  globalRules,
  triggerRules,
  dublicateItems,
}
