export const debounce = (func: (...args: any) => void, time: number) => {
  let timer: NodeJS.Timeout
  return async (...args: any) => {
    clearTimeout(timer)
    const result: any = await new Promise((resolve) => {
      timer = setTimeout(() => resolve(func(args)), time)
    })
    return result
  }
}
