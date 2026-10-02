import api from "./api";

// Helper to get active auth token for either employer or worker
const getAuthToken = () => {
  return sessionStorage.getItem("employerToken") || sessionStorage.getItem("token") || "";
};

// =================================
// CREATE RATING
// =================================
export const createRating = async ({ employmentId, rating, comment }) => {
  const token = getAuthToken();

  const response = await api.post(
    "/ratings/create",
    {
      employmentId,
      rating: Number(rating),
      comment: comment || "",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =================================
// GET USER RATINGS (Average & Reviews)
// =================================
export const getUserRatings = async (userId) => {
  const response = await api.get(`/ratings/user/${userId}`);
  return response.data;
};

// =================================
// CHECK MY RATING FOR AN EMPLOYMENT
// =================================
export const getMyRatingForEmployment = async (employmentId) => {
  const token = getAuthToken();

  const response = await api.get(
    `/ratings/employment/${employmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
