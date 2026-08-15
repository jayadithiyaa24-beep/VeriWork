import api from "./api";

// Worker Login
export const loginWorker = async (loginData) => {
  const response = await api.post(
    "/workers/login",
    loginData
  );

  return response.data;
};

// Get logged-in worker profile
export const getWorkerProfile = async () => {
  const token = localStorage.getItem("token");

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