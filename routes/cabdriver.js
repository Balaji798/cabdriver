const express = require("express");
const router = express.Router();

const cabdriverController = require("../controller/cabdriver");
const middleware = require("../middleware/authenticateUser")

router.post("/signup", cabdriverController.user_signup);
router.post("/login",cabdriverController.user_login)
router.post("/send_otp_aadhaar",middleware.authenticateToken, cabdriverController.send_otp_to_aadhaar);
router.post("/verify_aadhaar_otp",middleware.authenticateToken, cabdriverController.verify_aadhaar)

module.exports = router;