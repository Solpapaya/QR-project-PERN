const runPermutations = (words, indexes, query, firstPermutation, arr) => {
  // const words = 2;
  // let indexes = [];
  // let query = "SELECT * FROM person WHERE ";
  // let firstPermutation = true;
  // const arr = ["first_name", "second_name", "surname", "second_surname"];

  const permutations = (executions) => {
    if (executions === 0) {
      // console.log(indexes);
      for (let i = 0; i < indexes.length; i++) {
        if (!firstPermutation && i === 0) {
          query += "OR ";
        }
        if (i === words - 1) {
          if (arr[indexes[i]] === "second_name") {
            query += `COALESCE (second_name || ' ', '') ILIKE $1 `;
          } else {
            query += `${arr[indexes[i]]} ILIKE $1 `;
          }
        } else if (arr[indexes[i]] === "second_name") {
          query += `COALESCE (second_name || ' ', '') || `;
        } else {
          query += `${arr[indexes[i]]} || ' ' || `;
        }
      }
      // console.log(query);
      indexes.pop();
      firstPermutation = false;
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!indexes.includes(i)) {
        indexes.push(i);
        permutations(executions - 1);
      }
    }
    //   indexes = [];
    indexes.pop();
  };

  permutations(words);
  //   console.log(query);
  return query;
};

module.exports = {
  runPermutations,
};
