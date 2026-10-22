const Employment = require("../models/Employment");
const Worker = require("../models/Worker");


// =================================
// CONFLICT & AVAILABILITY HELPERS
// =================================

// Convert "HH:MM" (or "6:00 PM") to total minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;
  const trimmed = timeStr.trim().toUpperCase();

  // Check 12-hour AM/PM format (e.g. "6:00 PM", "06:00 PM", "6 PM")
  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPM = ampmMatch[3] === "PM";
    if (hours === 12) {
      hours = isPM ? 12 : 0;
    } else if (isPM) {
      hours += 12;
    }
    return hours * 60 + minutes;
  }

  // Check 24-hour format "HH:MM"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return hours * 60 + minutes;
    }
  }

  return null;
};

// Format time string to 12-hour AM/PM (e.g. "6:00 PM")
const formatTime12h = (timeStr) => {
  const mins = parseTimeToMinutes(timeStr);
  if (mins === null) return timeStr || "";
  let hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minPad = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minPad} ${ampm}`;
};

// Check if two calendar date ranges overlap
const checkDateRangeOverlap = (d1Start, d1End, d2Start, d2End, d1Active, d2Active) => {
  const start1 = new Date(d1Start);
  const start2 = new Date(d2Start);
  if (isNaN(start1.getTime()) || isNaN(start2.getTime())) return false;

  const s1 = new Date(start1.getFullYear(), start1.getMonth(), start1.getDate()).getTime();
  const s2 = new Date(start2.getFullYear(), start2.getMonth(), start2.getDate()).getTime();

  const end1 = d1End
    ? new Date(new Date(d1End).getFullYear(), new Date(d1End).getMonth(), new Date(d1End).getDate()).getTime()
    : (d1Active ? Infinity : s1);

  const end2 = d2End
    ? new Date(new Date(d2End).getFullYear(), new Date(d2End).getMonth(), new Date(d2End).getDate()).getTime()
    : (d2Active ? Infinity : s2);

  return s1 <= end2 && s2 <= end1;
};

// Helper to check standard non-wrapping interval overlap
const checkIntervalsOverlap = (startA, endA, startB, endB) => {
  return startA < endB && endA > startB;
};

// Check if two daily time windows overlap (handles standard day windows and midnight-spanning windows)
const checkTimeWindowOverlap = (timeAStart, timeAEnd, timeBStart, timeBEnd) => {
  const sA = parseTimeToMinutes(timeAStart);
  const eA = parseTimeToMinutes(timeAEnd);
  const sB = parseTimeToMinutes(timeBStart);
  const eB = parseTimeToMinutes(timeBEnd);

  // If no time is set on the existing or new job, default fallback to standard working window (09:00 - 17:00)
  const actualSA = sA !== null ? sA : 9 * 60;
  const actualEA = eA !== null ? eA : (actualSA + 60);
  const actualSB = sB !== null ? sB : 9 * 60;
  const actualEB = eB !== null ? eB : 17 * 60;

  // Normal non-wrapping windows
  if (actualSA < actualEA && actualSB < actualEB) {
    return actualSA < actualEB && actualEA > actualSB;
  }

  // If any window wraps across midnight (e.g., 09:00 to 07:00 next day, or 21:00 to 06:00),
  // split into sub-intervals within the 24-hour cycle [0, 1440]
  const intervalsA = actualSA < actualEA
    ? [[actualSA, actualEA]]
    : [[actualSA, 24 * 60], [0, actualEA]];

  const intervalsB = actualSB < actualEB
    ? [[actualSB, actualEB]]
    : [[actualSB, 24 * 60], [0, actualEB]];

  for (const [aStart, aEnd] of intervalsA) {
    for (const [bStart, bEnd] of intervalsB) {
      if (checkIntervalsOverlap(aStart, aEnd, bStart, bEnd)) {
        return true;
      }
    }
  }

  return false;
};

// Check both date AND time conflict
const checkDateTimeConflict = (existing, targetStartDate, targetEndDate, targetStartTime, targetEndTime) => {
  const dateOverlap = checkDateRangeOverlap(
    existing.startDate,
    existing.endDate,
    targetStartDate,
    targetEndDate,
    existing.status === "Active",
    !targetEndDate
  );

  if (!dateOverlap) {
    return false; // Dates don't overlap at all -> No conflict
  }

  // Dates match/overlap! Now check time:
  // If the date matches and time is different -> no problem!
  // If the time also overlaps -> conflict!
  return checkTimeWindowOverlap(
    targetStartTime,
    targetEndTime,
    existing.startTime,
    existing.endTime
  );
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

  const existingTimeStr = existing.startTime && existing.endTime
    ? `${formatTime12h(existing.startTime)} – ${formatTime12h(existing.endTime)}`
    : "09:00 AM – 05:00 PM";

  return {
    isConflict: true,
    jobRole: existing.jobRole,
    employerName: employerName,
    startDate: existing.startDate,
    endDate: existing.endDate,
    startTime: existing.startTime,
    endTime: existing.endTime,
    existingHours: existingTimeStr,
    status: existing.status,
    formattedPeriod: `${startFormatted} – ${endFormatted}`,
    message: `Worker is already hired at this time (${existingTimeStr}) by ${employerName} on overlapping dates (${startFormatted} – ${endFormatted}). Please give some other time.`,
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
    const startTime = req.body.startTime || req.query.startTime;
    const endTime = req.body.endTime || req.query.endTime;

    if (!workerEmail) {
      return res.status(400).json({
        success: false,
        message: "Worker email is required",
      });
    }

    // Daily work start time must be less than daily work end time
    if (startTime && endTime) {
      const sM = parseTimeToMinutes(startTime);
      const eM = parseTimeToMinutes(endTime);
      if (sM !== null && eM !== null && sM >= eM) {
        return res.status(400).json({
          success: false,
          available: false,
          isInvalidTimeRange: true,
          message: "Daily work start time must be less than daily work end time (e.g. 09:00 AM to 05:00 PM).",
        });
      }
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
      // If no start date provided yet
      return res.status(200).json({
        success: true,
        available: true,
        workerFound: true,
        workerName: worker.fullName,
        message: "Worker found. Please enter requested dates and work hours.",
      });
    }

    // Check date and time conflict
    const conflictingEmployment = existingEmployments.find((e) =>
      checkDateTimeConflict(e, startDate, endDate, startTime, endTime)
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

    const requestedHours = startTime && endTime
      ? ` at ${formatTime12h(startTime)} – ${formatTime12h(endTime)}`
      : "";

    return res.status(200).json({
      success: true,
      available: true,
      workerFound: true,
      workerName: worker.fullName,
      message: `Worker is free and available during these requested hours${requestedHours}.`,
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
      startTime,
      endTime,
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
        message: "Worker email, job role, salary, and start date are required",
      });
    }

    if (startTime && endTime) {
      const sM = parseTimeToMinutes(startTime);
      const eM = parseTimeToMinutes(endTime);
      if (sM !== null && eM !== null && sM >= eM) {
        return res.status(400).json({
          success: false,
          isInvalidTimeRange: true,
          message: "Daily work start time must be less than daily work end time",
        });
      }
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

    // Check for conflicting employment dates and times
    const existingEmployments = await Employment.find({
      workerId: worker._id,
    }).populate("employerId", "employerName email");

    const conflictingEmployment = existingEmployments.find((e) =>
      checkDateTimeConflict(e, startDate, endDate, startTime, endTime)
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
      startTime: startTime || null,
      endTime: endTime || null,
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
  _helpers: {
    parseTimeToMinutes,
    formatTime12h,
    checkDateRangeOverlap,
    checkTimeWindowOverlap,
    checkDateTimeConflict,
  },
};