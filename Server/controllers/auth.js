const User = require("../models/User");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const EmailModel = require("../models/EmailModel");

function generateUniqueCode() {
  const timestamp = new Date().getTime();

  const timestampString = timestamp.toString().slice(0, -3);

  const lastSixDigits = timestampString.slice(-6);

  let uniqueCode = parseInt(lastSixDigits);

  while (uniqueCode < 100000) {
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
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUserFolderOnGithub = async (userId) => {
  const repoName = process.env.CODE_BASE;
  const owner = process.env.REPO_OWNER;
  const folderPath = `${userId}/placeholder.txt`;

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${folderPath}`,
      {
        message: "Initial commit for user folder",
        content: Buffer.from("User folder initialization.").toString("base64"),
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

const contactUs = async (req, res) => {
  try {
    const { name, email, contactNo, message } = req.body;

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
      to: process.env.EMAIL,
      subject: "New Message from Contact Form",
      text: `
          Name: ${name}
          Email: ${email}
          Contact No: ${contactNo}
          Message: ${message}
        `,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
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
      subject: "Email verification for codeCanvas website",
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
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotOTP = async (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  const verificationCode = generateUniqueCode();
  try {
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
      subject: "Email verification for codeCanva website",
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
    console.error("Error during sign up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);

  const { email, password, otp, otpId } = req.body;

  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const emailModel = await EmailModel.findById(otpId);
    if (!emailModel) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (
      emailModel.email !== email.toLowerCase() ||
      emailModel.verificationCode !== otp
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await emailModel.deleteOne();

    const hashedPassword = await bcrypt.hash(password, 10);

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
  contactUs,
};
