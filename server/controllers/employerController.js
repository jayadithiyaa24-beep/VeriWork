const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");

// =================================
// EMPLOYER REGISTRATION
// =================================

const registerEmployer = async (req, res) => {
  try {
    const {
      employerName,
      phone,
      email,
      password,
    } = req.body;

    if (
      !employerName ||
      !phone ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Input validation
    const cleanedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingEmployer = await Employer.findOne({
      email: cleanedEmail,
    });

    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: "Employer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const employer = await Employer.create({
      employerName: employerName.trim(),
      phone: cleanedPhone,
      email: cleanedEmail,
      password: hashedPassword,
    });

    const employerResponse = employer.toObject();

    delete employerResponse.password;

    return res.status(201).json({
      success: true,
      message: "Employer Registered Successfully",
      employer: employerResponse,
    });
  } catch (error) {
    console.error("Employer Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// EMPLOYER LOGIN
// =================================

const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanedEmail = email.trim().toLowerCase();

    const employer = await Employer.findOne({
      email: cleanedEmail,
    });

    if (!employer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      employer.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: employer._id,
        email: employer.email,
        role: "employer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const employerResponse = employer.toObject();

    delete employerResponse.password;

    return res.status(200).json({
      success: true,
      message: "Employer Login Successful",
      token,
      employer: employerResponse,
    });
  } catch (error) {
    console.error("Employer Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// GET EMPLOYER PROFILE
// =================================

const getEmployerProfile = async (req, res) => {
  try {
    // req.user.id comes from JWT middleware
    const employer = await Employer.findById(
      req.user.id
    ).select("-password");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    return res.status(200).json({
      success: true,
      employer,
    });
  } catch (error) {
    console.error("Get Employer Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// AUTHORIZE EMPLOYER WALLET ON BLOCKCHAIN
// =================================

const authorizeEmployerWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    const { ethers } = require("ethers");
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ethereum wallet address format",
      });
    }

    const {
      authorizeIssuerOnBlockchain,
    } = require("../services/blockchainService");

    const result = await authorizeIssuerOnBlockchain(walletAddress);

    // Save wallet address in employer record
    await Employer.findByIdAndUpdate(req.user.id, {
      walletAddress: walletAddress.toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      message: result.alreadyAuthorized
        ? "Wallet is already an authorized issuer on blockchain"
        : "Wallet successfully authorized as certificate issuer on blockchain",
      walletAddress,
      transactionHash: result.transactionHash || null,
      isIssuer: true,
    });
  } catch (error) {
    console.error("Authorize Employer Wallet Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to authorize wallet on blockchain",
    });
  }
};

// =================================
// EXPORT CONTROLLERS
// =================================

module.exports = {
  registerEmployer,
  loginEmployer,
  getEmployerProfile,
  authorizeEmployerWallet,
};