export function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    let varA;
    let varB;

    if (key === "creation_date") {
      const splittedDateA = a[key].split("/");
      const splittedDateB = b[key].split("/");
      varA = new Date(
        splittedDateA[2],
        parseInt(splittedDateA[1]) - 1,
        splittedDateA[0]
      );
      varB = new Date(
        splittedDateB[2],
        parseInt(splittedDateB[1]) - 1,
        splittedDateB[0]
      );
    } else {
      varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      if (varA === null || varA === "") {
        varA = "ZZZ";
      }
      if (varB === null || varB === "") {
        varB = "ZZZ";
      }
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
