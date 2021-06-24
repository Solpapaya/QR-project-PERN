const router = require("express").Router();

// --------------------------------IMPORTING MIDDLEWARE--------------------------------
const { authUser, getRole } = require("../middleware/authorization");

router.get("/", authUser, getRole, (req, res) => {
  const { userType } = req;
  res.status(200).json({ isAuth: true, userType });
});

module.exports = router;
