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

    const existingWorker = await Worker.findOne({ email });

    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      fullName,
      email,
      phone,
      aadhaar,
      address,
      skills,
      experience,
      password: hashedPassword,
    });

    const workerResponse = worker.toObject();

    // Never send password to frontend
    delete workerResponse.password;

    res.status(201).json({
      success: true,
      message: "Worker Registered Successfully",
      worker: workerResponse,
    });

  } catch (error) {
    res.status(500).json({
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

    // Find worker
    const worker = await Worker.findOne({ email });

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

    // Remove password from response
    const workerResponse = worker.toObject();

    delete workerResponse.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      worker: workerResponse,
    });

  } catch (error) {
    res.status(500).json({
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
    const worker = await Worker.findById(req.user.id)
      .select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });

  } catch (error) {
    res.status(500).json({
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
};