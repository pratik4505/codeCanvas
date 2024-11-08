const User = require("../models/User");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const EmailModel = require("../models/EmailModel");

function generateUniqueCode() {
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Convert timestamp to string and remove milliseconds
  const timestampString = timestamp.toString().slice(0, -3);

  // Extract last 6 digits from the timestamp string
  const lastSixDigits = timestampString.slice(-6);

  // Ensure there are no leading zeros
  let uniqueCode = parseInt(lastSixDigits);

  // Check if the unique code has leading zeros
  while (uniqueCode < 100000) {
    // If so, multiply by 10 until it's a 6-digit number
    uniqueCode *= 10;
  }

  return uniqueCode;
}

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let loadedUser = await User.findOne({ emailId: email.toLowerCase() });
    if (!loadedUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isEqual) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: loadedUser._id.toString(),
        name: loadedUser.name,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      data: {
        accessToken: token,
        userId: loadedUser._id.toString(),
        name: loadedUser.name,
      },
    });
  } catch (err) {
    // Handle other errors
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUserFolderOnGithub = async (userId) => {
  const repoName = "codecanvas";
  const owner = "vaibhavMNNIT";
  const folderPath = `${userId}/placeholder.txt`; // GitHub requires a file, so we create an empty one

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${folderPath}`,
      {
        message: "Initial commit for user folder",
        content: Buffer.from("User folder initialization.").toString("base64"), // Encode content in base64
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    console.log("User folder created on GitHub:", response.data);
  } catch (error) {
    console.error("Error creating user folder on GitHub:", error);
  }
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password, otp, otpId } = req.body;

  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({ emailId: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const emailModel = await EmailModel.findById(otpId);
    if (!emailModel) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (emailModel.email !== email || emailModel.verificationCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const emailParts = email.toLowerCase().split("@");
    const userNameBase = emailParts[0];
    const mailServer = emailParts[1].split(".")[0];
    let userName = `${userNameBase}_${mailServer}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      emailId: email.toLowerCase(),
      password: hashedPassword,
      name: userName,
    });

    const savedUser = await newUser.save();
    console.log("User created:", savedUser);

    // Call GitHub folder creation function
    await createUserFolderOnGithub(savedUser._id);

    res.status(201).json({ message: "User created!", userId: savedUser._id });
  } catch (err) {
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpOTP = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  const verificationCode = generateUniqueCode();
  try {
    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = transporter.sendMail({
      to: [email.toLowerCase()],
      subject: "Email verification for carpooling website",
      text: `Your OTP is : ${verificationCode}`,
    });

    const emailModel = new EmailModel({
      email: email.toLowerCase(),
      verificationCode,
    });
    await emailModel.save();

    res
      .status(200)
      .json({ message: "OTP sent successfully", _id: emailModel._id });
  } catch (err) {
    // Handle other errors
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotOTP = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  const verificationCode = generateUniqueCode();
  try {
    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = transporter.sendMail({
      to: [email.toLowerCase()],
      subject: "Email verification for carpooling website",
      text: `Your OTP is : ${verificationCode}`,
    });

    const emailModel = new EmailModel({
      email: email.toLowerCase(),
      verificationCode,
    });
    await emailModel.save();

    res
      .status(200)
      .json({ message: "OTP sent successfully", _id: emailModel._id });
  } catch (err) {
    // Handle other errors
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);

  const { email, password, otp, otpId } = req.body;

  try {
    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Retrieve email verification model
    const emailModel = await EmailModel.findById(otpId);
    if (!emailModel) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Compare email and OTP
    if (
      emailModel.email !== email.toLowerCase() ||
      emailModel.verificationCode !== otp
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await emailModel.deleteOne();
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const user = await User.findOneAndUpdate(
      { emailId: email.toLowerCase() },
      { password: hashedPassword }
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error during password change:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  login,
  signUp,
  signUpOTP,
  forgotOTP,
  changePassword,
};
