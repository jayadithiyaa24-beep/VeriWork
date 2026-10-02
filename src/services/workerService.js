import api from "./api";

export const registerWorker = async (workerData) => {
  const response = await api.post("/workers/register", workerData);
  return response.data;
};

export const connectWorkerWallet = async (walletAddress) => {
  const token = sessionStorage.getItem("token");
  const response = await api.post(
    "/workers/connect-wallet",
    { walletAddress },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};