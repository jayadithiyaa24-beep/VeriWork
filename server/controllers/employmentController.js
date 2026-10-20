const Employment = require("../models/Employment");
const Worker = require("../models/Worker");


// =================================
// CONFLICT & AVAILABILITY HELPERS
// =================================

const checkDateConflict = (existing, targetStartDate, targetEndDate) => {
  const exStart = new Date(existing.startDate);
  const exEnd = existing.endDate ? new Date(existing.endDate) : null;
  const targetStart = new Date(targetStartDate);
  const targetEnd = targetEndDate ? new Date(targetEndDate) : null;

  if (isNaN(targetStart.getTime())) return false;

  // Active employment (currently ongoing)
  if (existing.status === "Active") {
    if (!exEnd) {
      // Ongoing with no set end date
      if (targetStart >= exStart) return true;
      if (targetEnd && targetEnd >= exStart) return true;
      if (!targetEnd) return true;
    } else {
      // Active with a designated end date
      if (targetEnd) {
        if (targetStart <= exEnd && targetEnd >= exStart) return true;
      } else {
        if (targetStart <= exEnd) return true;
      }
    }
  } else if (existing.status === "Completed" && exEnd) {
    if (targetEnd) {
      if (targetStart <= exEnd && targetEnd >= exStart) return true;
    } else {
      if (targetStart >= exStart && targetStart <= exEnd) return true;
    }
  }

  return false;
};

const formatConflictDetails = (existing) => {
  const employerName = existing.employerId?.employerName || "another employer";
  const startFormatted = new Date(existing.startDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const endFormatted = existing.endDate
    ? new Date(existing.endDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Present (Ongoing)";

  return {
    isConflict: true,
    jobRole: existing.jobRole,
    employerName: employerName,
    startDate: existing.startDate,
    endDate: existing.endDate,
    status: existing.status,
    formattedPeriod: `${startFormatted} – ${endFormatted}`,
    message: `Worker is already employed as "${existing.jobRole}" with ${employerName} (${startFormatted} – ${endFormatted}). Cannot recruit for overlapping dates.`,
  };
};


// =================================
// CHECK WORKER AVAILABILITY
// =================================

const checkWorkerAvailability = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can check worker availability",
      });
    }

    const workerEmail = (req.body.workerEmail || req.query.workerEmail || "").trim().toLowerCase();
    const startDate = req.body.startDate || req.query.startDate;
    const endDate = req.body.endDate || req.query.endDate;

    if (!workerEmail) {
      return res.status(400).json({
        success: false,
        message: "Worker email is required",
      });
    }

    const worker = await Worker.findOne({ email: workerEmail }).select("_id fullName email");
    if (!worker) {
      return res.status(404).json({
        success: false,
        available: false,
        workerFound: false,
        message: "No registered worker found with this email",
      });
    }

    // Find all employments for this worker
    const existingEmployments = await Employment.find({
      workerId: worker._id,
    }).populate("employerId", "employerName email phone");

    if (!startDate) {
      // If no start date provided yet, check if worker has ANY currently active employment
      const activeJob = existingEmployments.find((e) => e.status === "Active");
      if (activeJob) {
        const conflict = formatConflictDetails(activeJob);
        return res.status(200).json({
          success: true,
          available: false,
          workerFound: true,
          workerName: worker.fullName,
          conflict,
          message: conflict.message,
        });
      }

      return res.status(200).json({
        success: true,
        available: true,
        workerFound: true,
        workerName: worker.fullName,
        message: "Worker is currently not assigned to any active employment.",
      });
    }

    // Check specific date conflict
    const conflictingEmployment = existingEmployments.find((e) =>
      checkDateConflict(e, startDate, endDate)
    );

    if (conflictingEmployment) {
      const conflict = formatConflictDetails(conflictingEmployment);
      return res.status(200).json({
        success: true,
        available: false,
        workerFound: true,
        workerName: worker.fullName,
        conflict,
        message: conflict.message,
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      workerFound: true,
      workerName: worker.fullName,
      message: "Worker is free and available on the selected dates.",
    });
  } catch (error) {
    console.error("Check Worker Availability Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
      endDate,
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

    // Check for conflicting employment dates
    const existingEmployments = await Employment.find({
      workerId: worker._id,
    }).populate("employerId", "employerName email");

    const conflictingEmployment = existingEmployments.find((e) =>
      checkDateConflict(e, startDate, endDate)
    );

    if (conflictingEmployment) {
      const conflict = formatConflictDetails(conflictingEmployment);
      return res.status(409).json({
        success: false,
        isConflict: true,
        conflict,
        message: conflict.message,
      });
    }

    // Create employment record
    const employment = await Employment.create({
      workerId: worker._id,
      employerId: req.user.id,
      jobRole,
      salary,
      startDate,
      endDate: endDate || null,
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
  checkWorkerAvailability,
  createEmployment,
  getEmployerEmployments,
  getWorkerEmployments,
  completeEmployment,
};