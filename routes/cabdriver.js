const express = require("express");
const router = express.Router();

const cabdriverController = require("../controller/cabdriver")

router.post("/signup", cabdriverController.user_signup);
router.post("/login",cabdriverController.user_login)
router.post("/send_otp_aadhaar", cabdriverController.send_otp_to_aadhaar);
router.post("/verify_aadhaar_otp",cabdriverController.verify_aadhaar)

module.exports = router;