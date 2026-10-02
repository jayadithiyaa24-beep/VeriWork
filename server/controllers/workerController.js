const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Worker = require("../models/Worker");

// =================================
// WORKER REGISTRATION
// =================================

const registerWorker = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      aadhaar,
      address,
      skills,
      experience,
      password,
    } = req.body;

    // Check whether all required fields are provided
    if (
      !fullName ||
      !email ||
      !phone ||
      !aadhaar ||
      !address ||
      !skills ||
      !experience ||
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

    const cleanedAadhaar = aadhaar.replace(/\D/g, "");
    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be exactly 12 digits.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if worker already exists by email or Aadhaar
    const existingWorker = await Worker.findOne({
      $or: [{ email: cleanedEmail }, { aadhaar: cleanedAadhaar }],
    });

    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: existingWorker.email === cleanedEmail
          ? "Worker with this email already exists."
          : "Worker with this Aadhaar number already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create worker
    const worker = await Worker.create({
      fullName: fullName.trim(),
      email: cleanedEmail,
      phone: cleanedPhone,
      aadhaar: cleanedAadhaar,
      address: address.trim(),
      skills: skills.trim(),
      experience: Number(experience) || 0,
      password: hashedPassword,
    });

    // Remove password & mask Aadhaar before sending response
    const workerResponse = worker.toObject();
    delete workerResponse.password;
    workerResponse.aadhaar = `XXXX-XXXX-${cleanedAadhaar.slice(-4)}`;

    return res.status(201).json({
      success: true,
      message: "Worker Registered Successfully",
      worker: workerResponse,
    });
  } catch (error) {
    console.error("Worker Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// WORKER LOGIN
// =================================

const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanedEmail = email.trim().toLowerCase();

    // Find worker by email
    const worker = await Worker.findOne({ email: cleanedEmail });

    if (!worker) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      worker.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: worker._id,
        email: worker.email,
        role: "worker",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Remove password and mask Aadhaar before sending worker data
    const workerResponse = worker.toObject();
    delete workerResponse.password;
    if (workerResponse.aadhaar) {
      workerResponse.aadhaar = `XXXX-XXXX-${workerResponse.aadhaar.slice(-4)}`;
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      worker: workerResponse,
    });
  } catch (error) {
    console.error("Worker Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// GET WORKER PROFILE
// =================================

const getWorkerProfile = async (req, res) => {
  try {
    // req.user.id comes from JWT middleware
    const worker = await Worker.findById(req.user.id).select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const workerResponse = worker.toObject();
    if (workerResponse.aadhaar) {
      workerResponse.aadhaar = `XXXX-XXXX-${workerResponse.aadhaar.slice(-4)}`;
    }

    return res.status(200).json({
      success: true,
      worker: workerResponse,
    });
  } catch (error) {
    console.error("Get Worker Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// CONNECT WORKER WALLET
// =================================

const connectWorkerWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      { walletAddress: walletAddress.toLowerCase().trim() },
      { new: true }
    ).select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    const workerResponse = worker.toObject();
    if (workerResponse.aadhaar) {
      workerResponse.aadhaar = `XXXX-XXXX-${workerResponse.aadhaar.slice(-4)}`;
    }

    return res.status(200).json({
      success: true,
      message: "Worker wallet connected successfully",
      worker: workerResponse,
      walletAddress: worker.walletAddress,
    });
  } catch (error) {
    console.error("Connect Worker Wallet Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =================================
// EXPORT CONTROLLERS
// =================================

module.exports = {
  registerWorker,
  loginWorker,
  getWorkerProfile,
  connectWorkerWallet,
};