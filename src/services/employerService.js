import api from "./api";

// =================================
// EMPLOYER REGISTRATION
// =================================

export const registerEmployer = async (employerData) => {
  const response = await api.post(
    "/employers/register",
    employerData
  );

  return response.data;
};

// =================================
// CREATE EMPLOYMENT
// =================================

export const createEmployment = async (employmentData) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    "/employment/create",
    employmentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =================================
// GET EMPLOYER EMPLOYMENTS
// =================================

export const getEmployerEmployments = async () => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.get(
    "/employment/employer",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =================================
// GET WORKER EMPLOYMENT HISTORY
// =================================

export const getWorkerEmployments = async () => {
  const token = sessionStorage.getItem("token");

  const response = await api.get(
    "/employment/worker",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =================================
// AUTHORIZE WALLET AS ISSUER
// =================================

export const authorizeEmployerWallet = async (walletAddress) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    "/employers/authorize-wallet",
    { walletAddress },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};