const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");

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

module.exports = {
  registerWorker,
};
