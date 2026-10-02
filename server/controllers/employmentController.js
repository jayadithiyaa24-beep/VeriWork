const Employment = require("../models/Employment");
const Worker = require("../models/Worker");


// =================================
// CREATE EMPLOYMENT RECORD
// =================================

const createEmployment = async (req, res) => {
  try {
    // Only employers can create employment records
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create employment records",
      });
    }

    const {
      workerEmail,
      jobRole,
      salary,
      startDate,
    } = req.body;

    // Check required fields
    if (
      !workerEmail ||
      !jobRole ||
      salary === undefined ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All employment fields are required",
      });
    }

    // Find worker using email (strictly shielding sensitive PII)
    const worker = await Worker.findOne({
      email: workerEmail.trim().toLowerCase(),
    }).select("-password -aadhaar -address");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Create employment record
    const employment = await Employment.create({
      workerId: worker._id,
      employerId: req.user.id,
      jobRole,
      salary,
      startDate,
      status: "Active",
      verificationStatus: "Pending",
    });

    // Populate worker and employer details
    const populatedEmployment =
      await Employment.findById(employment._id)
        .populate("workerId", "fullName email phone")
        .populate(
          "employerId",
          "employerName email phone"
        );

    res.status(201).json({
      success: true,
      message: "Employment Record Created Successfully",
      employment: populatedEmployment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =================================
// GET EMPLOYER EMPLOYMENTS
// =================================

const getEmployerEmployments = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can access this data",
      });
    }

    const employments = await Employment.find({
      employerId: req.user.id,
    })
      .populate("workerId", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      employments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =================================
// GET WORKER EMPLOYMENT HISTORY
// =================================

const getWorkerEmployments = async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can access this data",
      });
    }

    const employments = await Employment.find({
      workerId: req.user.id,
    })
      .populate(
        "employerId",
        "employerName email phone"
      )
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      employments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =================================
// COMPLETE EMPLOYMENT
// =================================

const completeEmployment = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can mark employment as completed",
      });
    }

    const { id } = req.params;

    const employment = await Employment.findById(id);

    if (!employment) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found",
      });
    }

    if (employment.employerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this employment record",
      });
    }

    if (employment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Employment is already marked as completed",
      });
    }

    employment.status = "Completed";
    if (!employment.endDate) {
      employment.endDate = new Date();
    }

    await employment.save();

    const populatedEmployment = await Employment.findById(employment._id)
      .populate("workerId", "fullName email phone")
      .populate("employerId", "employerName email phone");

    res.status(200).json({
      success: true,
      message: "Employment completed successfully",
      employment: populatedEmployment,
    });
  } catch (error) {
    console.error("Complete Employment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createEmployment,
  getEmployerEmployments,
  getWorkerEmployments,
  completeEmployment,
};