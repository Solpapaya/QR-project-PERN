require("dotenv").config();
const cors = require("cors");
const fs = require("fs");

// Server Instance
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

// ------------------------------------DIRECTORIES------------------------------------
const { tmpDirectory, keyPairDirectory } = require("./consts/variables");

// Function that generates keys
const { generateKeyPair } = require("./functions/generateKeyPair");

// Creates new directory for storing temporary files if it doesn't already exist
if (!fs.existsSync(tmpDirectory)) fs.mkdirSync(tmpDirectory);

// Generate Key Pair For Signing and Verifying JWT Tokens
if (!fs.existsSync(keyPairDirectory)) {
  fs.mkdirSync(keyPairDirectory);
  generateKeyPair(keyPairDirectory);
}

// Accept request from other domains
app.use(cors());
// Parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// ------------------------------------ROUTES------------------------------------
app.use("/people", require("./routes/people"));
app.use("/departments", require("./routes/departments"));
app.use("/statuslogs", require("./routes/statusLogs"));
app.use("/taxreceipts", require("./routes/taxReceipts"));
app.use("/deleted/taxreceipts", require("./routes/deletedTaxReceipts"));
app.use("/person", require("./routes/person"));
app.use("/users", require("./routes/users"));
app.use("/login", require("./routes/login"));
app.use("/auth", require("./routes/auth"));
app.use("/forgot-password", require("./routes/forgotPassword"));
app.use("/change-password", require("./routes/changePassword"));

app.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
