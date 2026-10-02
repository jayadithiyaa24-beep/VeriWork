// =========================================================
// TAB-SCOPED PRIVACY STORAGE UTILITY
// =========================================================
// Uses sessionStorage so credentials are strictly scoped to the active tab.
// Copying/pasting links into a new tab or window will NOT open a user's account;
// it will immediately redirect unauthorized new tabs to the login page.

export const storage = {
  // Worker Token & Session
  getWorkerToken: () => sessionStorage.getItem("token"),
  setWorkerToken: (token) => sessionStorage.setItem("token", token),
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
  setWorker: (worker) => sessionStorage.setItem("worker", JSON.stringify(worker)),
  removeWorker: () => {
    sessionStorage.removeItem("worker");
    localStorage.removeItem("worker");
  },

  // Employer Token & Session
  getEmployerToken: () => sessionStorage.getItem("employerToken"),
  setEmployerToken: (token) => sessionStorage.setItem("employerToken", token),
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
  setEmployer: (employer) => sessionStorage.setItem("employer", JSON.stringify(employer)),
  removeEmployer: () => {
    sessionStorage.removeItem("employer");
    localStorage.removeItem("employer");
  },

  // Wallets (scoped to session)
  getWorkerWallet: () => sessionStorage.getItem("workerWallet") || "",
  setWorkerWallet: (addr) => sessionStorage.setItem("workerWallet", addr),
  removeWorkerWallet: () => {
    sessionStorage.removeItem("workerWallet");
    localStorage.removeItem("workerWallet");
  },

  getEmployerWallet: () => sessionStorage.getItem("employerWallet") || "",
  setEmployerWallet: (addr) => sessionStorage.setItem("employerWallet", addr),
  removeEmployerWallet: () => {
    sessionStorage.removeItem("employerWallet");
    localStorage.removeItem("employerWallet");
  },

  // Global Clean Legacy
  purgeLegacyPersistentStorage: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    localStorage.removeItem("employerToken");
    localStorage.removeItem("employer");
  },
};

export default storage;
