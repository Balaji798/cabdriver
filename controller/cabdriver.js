const axios = require("axios");
const cabdriverModel = require("../model/cabdriver");
const jwt = require("jsonwebtoken");

exports.user_signup = async (req, res) => {
  try {
    const { firstName, email, lastName, mobileNumber } = await req.body;
    const reqUser = await cabdriverModel.findOne({
      mobileNumber: mobileNumber,
    });
    if (
      email !== "" &&
      !/\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      console.log(/\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/.test(email));
      return res
        .status(200)
        .send({ status: false, data: {}, message: "Invalid email id" });
    }
    if (reqUser) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "User already exists" });
    }
    const user = await cabdriverModel.create({
      firstName,
      lastName,
      email,
      mobileNumber,
    });
    const payload = {
      userId: user._id,
      mobileNumber: req.body.mobileNumber,
    };

    const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    return res.status(200).send({
      status: true,
      data: { token: generatedToken, user: user },
      message: "Signup Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.user_login = async (req, res) => {
  try {
    const user = await cabdriverModel.findOne({
      mobileNumber: req.body.mobileNumber,
    });

    if (!user) {
      return res
        .status(200)
        .send({ status: false, data: {}, message: "user dose not exist" });
    }
    if (user) {
      const payload = {
        userId: user._id,
        mobileNumber: req.body.mobileNumber,
      };

      const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      return res.status(200).send({
        status: true,
        data: { token: generatedToken, user: user },
        message: "User Login Successfully",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.send_otp_to_aadhaar = async (req, res) => {
  try {
    const { aadhaar_number } = req.body;
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/aadhaar/okyc/generate-otp",
      { aadhaar_number },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY, // Replace 'YOUR_API_KEY' with your actual API key
        },
      }
    );
    const data = response.data;
    res
      .status(200)
      .send({
        status: response.data.data.valid_aadhaar ? true : false,
        data,
        message: response.data.data.valid_aadhaar
          ? "OTP send successfully"
          : "Invalid aadhaar number",
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};

exports.verify_aadhaar = async (req, res) => {
  try {
    const { otp } = req.body;
    const { client_id } = req.body;
    const response = await axios.post(
      "https://api.idcentral.io/idc/v2/aadhaar/okyc/submit-otp",
      { otp, client_id }, // Include client_id in the request body
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.AADHAAR_API_KEY, // Replace 'YOUR_API_KEY' with your actual API key
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (data.status === "success") {
      await cabdriverModel.findOneAndUpdate(
        { _id: req.user },
        { aadhaar_number: req.body.aadhaar_number }
      );
      res
        .status(200)
        .json({ status: true, data, message: "Verification successful" });
    } else {
      res
        .status(400)
        .json({ status: false, data, message: "Verification failed" });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
exports.add_driver = async (req, res) => {
  try {
    const data = await cabdriverModel.create();
  } catch (err) {
    return res.status(500).send({
      status: false,
      data: { errorMessage: err.message },
      message: "server error",
    });
  }
};
