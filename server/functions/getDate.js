// Gets Today's date
const getDate = () => {
  const dateObj = new Date().toLocaleString().split(",")[0];

  const month = dateObj.split("/")[0];
  const day = dateObj.split("/")[1];
  const year = dateObj.split("/")[2];

  const newDate = year + "/" + month + "/" + day;
  return newDate;
};

module.exports = {
  getDate,
};
