require("dotenv").config();
const cors = require("cors");
const fs = require("fs");

// Server Instance
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

const { tmpDirectory } = require("./consts/variables");
// Creates new directory for storing temporary files if it doesn't already exist
if (!fs.existsSync(tmpDirectory)) {
  fs.mkdirSync(tmpDirectory);
}

// Accept request from other domains
app.use(cors());
// Parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

const { getDate } = require("./functions/getDate");
getDate();

// ------------------------------------ROUTES------------------------------------
app.use("/people", require("./routes/people"));
app.use("/departments", require("./routes/departments"));
app.use("/statuslogs", require("./routes/statusLogs"));
app.use("/taxreceipts", require("./routes/taxReceipts"));
app.use("/person", require("./routes/person"));

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
