export function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    let varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    let varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    if (varA === null) {
      varA = "ZZZ";
    }
    if (varB === null) {
      varB = "ZZZ";
    }
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}
