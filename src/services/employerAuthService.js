import api from "./api";

// =================================
// EMPLOYER LOGIN
// =================================

export const loginEmployer = async (loginData) => {
  const response = await api.post(
    "/employers/login",
    loginData
  );

  return response.data;
};

// =================================
// GET LOGGED-IN EMPLOYER PROFILE
// =================================

export const getEmployerProfile = async () => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.get(
    "/employers/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};