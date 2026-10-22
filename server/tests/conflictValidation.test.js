const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { _helpers } = require("../controllers/employmentController");
const {
  parseTimeToMinutes,
  formatTime12h,
  checkDateRangeOverlap,
  checkTimeWindowOverlap,
  checkDateTimeConflict,
} = _helpers;

describe("Worker Employment Date & Time Conflict Validation", () => {
  describe("Time Parsing & Formatting", () => {
    it("should parse 24h format times correctly", () => {
      assert.equal(parseTimeToMinutes("06:00"), 360);
      assert.equal(parseTimeToMinutes("07:00"), 420);
      assert.equal(parseTimeToMinutes("18:00"), 1080);
      assert.equal(parseTimeToMinutes("19:00"), 1140);
    });

    it("should parse 12h AM/PM format times correctly", () => {
      assert.equal(parseTimeToMinutes("6:00 AM"), 360);
      assert.equal(parseTimeToMinutes("6:00 PM"), 1080);
      assert.equal(parseTimeToMinutes("7:00 PM"), 1140);
      assert.equal(parseTimeToMinutes("12:00 PM"), 720);
      assert.equal(parseTimeToMinutes("12:00 AM"), 0);
    });

    it("should format times into clean 12h representation", () => {
      assert.equal(formatTime12h("06:00"), "6:00 AM");
      assert.equal(formatTime12h("18:00"), "6:00 PM");
      assert.equal(formatTime12h("19:30"), "7:30 PM");
      assert.equal(formatTime12h("12:00"), "12:00 PM");
    });
  });

  describe("Daily Work Hours Overlap (checkTimeWindowOverlap)", () => {
    it("should detect overlapping time windows", () => {
      // 06:00-07:00 vs 06:30-07:30 -> overlaps
      assert.equal(checkTimeWindowOverlap("06:00", "07:00", "06:30", "07:30"), true);
      // Identical slot
      assert.equal(checkTimeWindowOverlap("18:00", "19:00", "18:00", "19:00"), true);
      // Enclosing slot: 06:00-10:00 vs 07:00-08:00
      assert.equal(checkTimeWindowOverlap("06:00", "10:00", "07:00", "08:00"), true);
    });

    it("should allow non-overlapping time windows on the same day", () => {
      // Morning (06:00-07:00) vs Evening (18:00-19:00) -> NO overlap
      assert.equal(checkTimeWindowOverlap("06:00", "07:00", "18:00", "19:00"), false);
      // Back-to-back: 06:00-07:00 vs 07:00-08:00 -> NO overlap
      assert.equal(checkTimeWindowOverlap("06:00", "07:00", "07:00", "08:00"), false);
    });

    it("should detect conflict when a wrapping window (e.g. 09:00 to 07:00 next day) encompasses 09:00 to 17:00", () => {
      // User scenario: 9 a.m to 7 a.m includes 9 a.m to 5 p.m
      assert.equal(checkTimeWindowOverlap("09:00", "07:00", "09:00", "17:00"), true);
      assert.equal(checkTimeWindowOverlap("21:00", "06:00", "22:00", "02:00"), true);
      assert.equal(checkTimeWindowOverlap("22:00", "04:00", "09:00", "17:00"), false);
    });

    it("should ALLOW another employer to hire from 5:00 PM to 9:00 AM when worker is hired from 9:00 AM to 5:00 PM", () => {
      // User requirement: Worker works 9am-5pm; another employer can hire from 5pm-9am (non-overlapping)
      assert.equal(checkTimeWindowOverlap("17:00", "09:00", "09:00", "17:00"), false);
      // But cannot hire 9am-7am (covers 9am-5pm)
      assert.equal(checkTimeWindowOverlap("09:00", "07:00", "09:00", "17:00"), true);
      // And cannot hire inside 9am-5pm (e.g. 10am-2pm or 2pm-8pm)
      assert.equal(checkTimeWindowOverlap("10:00", "14:00", "09:00", "17:00"), true);
      assert.equal(checkTimeWindowOverlap("14:00", "20:00", "09:00", "17:00"), true);
    });
  });

  describe("Calendar Date Overlap (checkDateRangeOverlap)", () => {
    it("should detect overlapping calendar date ranges", () => {
      assert.equal(
        checkDateRangeOverlap("2026-11-01", "2026-11-30", "2026-11-15", "2026-12-15"),
        true
      );
      assert.equal(
        checkDateRangeOverlap("2026-11-01", null, "2026-11-10", "2026-11-20", true, false),
        true
      );
    });

    it("should allow non-overlapping dates", () => {
      assert.equal(
        checkDateRangeOverlap("2026-01-01", "2026-01-31", "2026-02-01", "2026-02-28"),
        false
      );
    });
  });

  describe("Combined Date and Time Conflict Logic (User Requirement)", () => {
    const existingJob = {
      startDate: new Date("2026-11-01"),
      endDate: null,
      startTime: "06:00",
      endTime: "07:00",
      status: "Active",
    };

    it("should flag conflict when dates match AND daily hours overlap", () => {
      // Same date (2026-11-10) and same hours (06:00-07:00)
      const conflict = checkDateTimeConflict(
        existingJob,
        "2026-11-10",
        null,
        "06:00",
        "07:00"
      );
      assert.equal(conflict, true, "Worker is already hired at this time");
    });

    it("should flag conflict when dates match AND time partially overlaps (06:30 - 08:00)", () => {
      const conflict = checkDateTimeConflict(
        existingJob,
        "2026-11-10",
        "2026-11-20",
        "06:30",
        "08:00"
      );
      assert.equal(conflict, true, "Worker is already hired at overlapping time");
    });

    it("should ALLOW hiring when date matches but daily work time is different (e.g. 18:00 - 19:00)", () => {
      // User requirement: 'if the date matches and time is different , no problem'
      const conflict = checkDateTimeConflict(
        existingJob,
        "2026-11-10",
        null,
        "18:00",
        "19:00"
      );
      assert.equal(conflict, false, "Different time slot on same date must be allowed without conflict");
    });

    it("should ALLOW hiring when dates do not overlap even if daily hours are identical", () => {
      const completedPastJob = {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-06-30"),
        startTime: "06:00",
        endTime: "07:00",
        status: "Completed",
      };

      const conflict = checkDateTimeConflict(
        completedPastJob,
        "2026-11-10",
        null,
        "06:00",
        "07:00"
      );
      assert.equal(conflict, false);
    });

    it("should handle legacy employment records with no startTime/endTime gracefully", () => {
      const legacyJob = {
        startDate: new Date("2026-11-01"),
        endDate: null,
        startTime: null,
        endTime: null,
        status: "Active",
      };

      // Legacy job defaults to standard day hours (09:00 - 17:00)
      // 18:00-19:00 (evening) should NOT conflict
      const eveningConflict = checkDateTimeConflict(
        legacyJob,
        "2026-11-10",
        null,
        "18:00",
        "19:00"
      );
      assert.equal(eveningConflict, false);

      // 10:00-12:00 (inside standard hours) should conflict
      const dayConflict = checkDateTimeConflict(
        legacyJob,
        "2026-11-10",
        null,
        "10:00",
        "12:00"
      );
      assert.equal(dayConflict, true);
    });
  });
});
