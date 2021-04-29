const displayBelongOrg = (belong, parent) => {
  const o = [belong, parent]
  let s = o.join('/')
  if (!parent) {
    s = belong
  } else if (!belong) {
    s = parent
  } else if (!parent && !belong) {
    s = ''
  }
  return s
}

export { displayBelongOrg }
