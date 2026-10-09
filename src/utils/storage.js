// =========================================================
// WEB BROWSER STORAGE UTILITY
// =========================================================
// Uses sessionStorage for tab-scoped privacy (standard web behavior).
// All persistent mobile/Capacitor code has been completely removed.

export const storage = {
  // Retained as a resolved no-op for backward compatibility
  init: async () => {},

  // =========================================================
  // WORKER AUTHENTICATION & SESSION
  // =========================================================

  getWorkerToken: () => sessionStorage.getItem("token") || "",

  setWorkerToken: (token) => {
    sessionStorage.setItem("token", token);
  },

  removeWorkerToken: () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  },

  getWorker: () => {
    try {
      const data = sessionStorage.getItem("worker");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setWorker: (worker) => {
    const val = typeof worker === "string" ? worker : JSON.stringify(worker);
    sessionStorage.setItem("worker", val);
  },

  removeWorker: () => {
    sessionStorage.removeItem("worker");
    localStorage.removeItem("worker");
  },

  saveWorkerSession: ({ token, worker }) => {
    if (token) {
      sessionStorage.setItem("token", token);
    }
    if (worker) {
      const val = typeof worker === "string" ? worker : JSON.stringify(worker);
      sessionStorage.setItem("worker", val);
    }
  },

  clearWorkerSession: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("worker");
    sessionStorage.removeItem("workerWallet");
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    localStorage.removeItem("workerWallet");
  },

  // =========================================================
  // EMPLOYER AUTHENTICATION & SESSION
  // =========================================================

  getEmployerToken: () => sessionStorage.getItem("employerToken") || "",

  setEmployerToken: (token) => {
    sessionStorage.setItem("employerToken", token);
  },

  removeEmployerToken: () => {
    sessionStorage.removeItem("employerToken");
    localStorage.removeItem("employerToken");
  },

  getEmployer: () => {
    try {
      const data = sessionStorage.getItem("employer");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setEmployer: (employer) => {
    const val = typeof employer === "string" ? employer : JSON.stringify(employer);
    sessionStorage.setItem("employer", val);
  },

  removeEmployer: () => {
    sessionStorage.removeItem("employer");
    localStorage.removeItem("employer");
  },

  saveEmployerSession: ({ token, employer }) => {
    if (token) {
      sessionStorage.setItem("employerToken", token);
    }
    if (employer) {
      const val = typeof employer === "string" ? employer : JSON.stringify(employer);
      sessionStorage.setItem("employer", val);
    }
  },

  clearEmployerSession: () => {
    sessionStorage.removeItem("employerToken");
    sessionStorage.removeItem("employer");
    sessionStorage.removeItem("employerWallet");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employer");
    localStorage.removeItem("employerWallet");
  },

  // =========================================================
  // WALLET ADDRESSES
  // =========================================================

  getWorkerWallet: () => sessionStorage.getItem("workerWallet") || "",

  setWorkerWallet: (addr) => {
    sessionStorage.setItem("workerWallet", addr);
  },

  removeWorkerWallet: () => {
    sessionStorage.removeItem("workerWallet");
    localStorage.removeItem("workerWallet");
  },

  getEmployerWallet: () => sessionStorage.getItem("employerWallet") || "",

  setEmployerWallet: (addr) => {
    sessionStorage.setItem("employerWallet", addr);
  },

  removeEmployerWallet: () => {
    sessionStorage.removeItem("employerWallet");
    localStorage.removeItem("employerWallet");
  },

  // =========================================================
  // LEGACY CLEANUP
  // =========================================================

  purgeLegacyPersistentStorage: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employer");
  },
};

export default storage;
