import api from "./api";

export const getAdminOverview = async () => {
  const response = await api.get("/admin/overview");
  return response.data;
};

export const getAdminIssuers = async () => {
  const response = await api.get("/admin/issuers");
  return response.data;
};

export const authorizeAdminIssuer = async ({ walletAddress, employerId }) => {
  const response = await api.post("/admin/authorize-issuer", {
    walletAddress,
    employerId,
  });
  return response.data;
};

export const revokeAdminIssuer = async ({ walletAddress, employerId }) => {
  const response = await api.post("/admin/revoke-issuer", {
    walletAddress,
    employerId,
  });
  return response.data;
};

export const getAdminCertificates = async () => {
  const response = await api.get("/admin/certificates");
  return response.data;
};

export const inspectBlockchainCertificate = async (certificateId) => {
  const response = await api.get(`/admin/inspect/${encodeURIComponent(certificateId)}`);
  return response.data;
};
