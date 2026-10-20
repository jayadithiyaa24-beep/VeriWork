const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// Test the conflict resolution logic
describe("Worker Employment Date Conflict & Availability Validation", () => {
  const checkDateConflict = (existing, targetStartDate, targetEndDate) => {
    const exStart = new Date(existing.startDate);
    const exEnd = existing.endDate ? new Date(existing.endDate) : null;
    const targetStart = new Date(targetStartDate);
    const targetEnd = targetEndDate ? new Date(targetEndDate) : null;

    if (isNaN(targetStart.getTime())) return false;

    if (existing.status === "Active") {
      if (!exEnd) {
        if (targetStart >= exStart) return true;
        if (targetEnd && targetEnd >= exStart) return true;
        if (!targetEnd) return true;
      } else {
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

  it("should flag conflict when worker has an ongoing Active job and new start date is after or on active start date", () => {
    const activeJob = {
      startDate: new Date("2026-01-01"),
      endDate: null,
      status: "Active",
    };

    assert.equal(checkDateConflict(activeJob, "2026-05-01"), true);
    assert.equal(checkDateConflict(activeJob, "2026-01-01"), true);
    assert.equal(checkDateConflict(activeJob, "2026-10-20"), true);
  });

  it("should flag conflict when proposed job has no end date and overlaps an active job", () => {
    const activeJob = {
      startDate: new Date("2026-06-01"),
      endDate: null,
      status: "Active",
    };

    assert.equal(checkDateConflict(activeJob, "2026-04-01"), true);
  });

  it("should flag conflict when proposed start date falls within a completed job's date range", () => {
    const completedJob = {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      status: "Completed",
    };

    assert.equal(checkDateConflict(completedJob, "2025-06-15"), true);
    assert.equal(checkDateConflict(completedJob, "2025-01-01"), true);
    assert.equal(checkDateConflict(completedJob, "2025-12-31"), true);
  });

  it("should NOT flag conflict when proposed start date is after a completed job's end date", () => {
    const completedJob = {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      status: "Completed",
    };

    assert.equal(checkDateConflict(completedJob, "2026-01-01"), false);
    assert.equal(checkDateConflict(completedJob, "2026-10-20"), false);
  });

  it("should return false for invalid target dates", () => {
    const activeJob = {
      startDate: new Date("2026-01-01"),
      endDate: null,
      status: "Active",
    };

    assert.equal(checkDateConflict(activeJob, "invalid-date"), false);
  });
});
