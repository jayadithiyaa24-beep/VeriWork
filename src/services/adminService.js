import api from "./api";

const getAdminHeaders = () => {
  const adminKey = sessionStorage.getItem("adminKey") || "";
  const headers = {};
  if (adminKey) {
    headers["x-admin-key"] = adminKey;
  }
  return headers;
};

export const getAdminOverview = async () => {
  const response = await api.get("/admin/overview", {
    headers: getAdminHeaders(),
  });
  return response.data;
};

export const getAdminIssuers = async () => {
  const response = await api.get("/admin/issuers", {
    headers: getAdminHeaders(),
  });
  return response.data;
};

export const authorizeAdminIssuer = async ({ walletAddress, employerId }) => {
  const response = await api.post(
    "/admin/authorize-issuer",
    {
      walletAddress,
      employerId,
    },
    {
      headers: getAdminHeaders(),
    }
  );
  return response.data;
};

export const revokeAdminIssuer = async ({ walletAddress, employerId }) => {
  const response = await api.post(
    "/admin/revoke-issuer",
    {
      walletAddress,
      employerId,
    },
    {
      headers: getAdminHeaders(),
    }
  );
  return response.data;
};

export const getAdminCertificates = async () => {
  const response = await api.get("/admin/certificates", {
    headers: getAdminHeaders(),
  });
  return response.data;
};

export const inspectBlockchainCertificate = async (certificateId) => {
  const response = await api.get(
    `/admin/inspect/${encodeURIComponent(certificateId)}`,
    {
      headers: getAdminHeaders(),
    }
  );
  return response.data;
};
