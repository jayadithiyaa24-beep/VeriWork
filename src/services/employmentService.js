import api from "./api";

// =================================
// CHECK WORKER AVAILABILITY
// =================================

export const checkWorkerAvailability = async (queryData) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    "/employment/check-availability",
    queryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
// COMPLETE EMPLOYMENT
// =================================

export const completeEmployment = async (employmentId) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.put(
    `/employment/complete/${employmentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};