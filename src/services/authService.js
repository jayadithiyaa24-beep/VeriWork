import api from "./api";

// =================================
// WORKER LOGIN
// =================================

export const loginWorker = async (loginData) => {
  const response = await api.post(
    "/workers/login",
    loginData
  );

  return response.data;
};

// =================================
// GET LOGGED-IN WORKER PROFILE
// =================================

export const getWorkerProfile = async () => {
  const token = sessionStorage.getItem("token");

  const response = await api.get(
    "/workers/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};