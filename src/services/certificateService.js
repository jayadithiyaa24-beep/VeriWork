import api from "./api";


// =================================
// CREATE CERTIFICATE
// =================================

export const createCertificate = async (
  employmentId
) => {
  const token = sessionStorage.getItem(
    "employerToken"
  );

  const response = await api.post(
    "/certificates/create",
    {
      employmentId,
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
// CONFIRM BLOCKCHAIN REGISTRATION
// =================================

export const confirmBlockchainRegistration =
  async (
    certificateId,
    transactionHash
  ) => {
    const token = sessionStorage.getItem(
      "employerToken"
    );

    const response = await api.post(
      `/certificates/confirm-blockchain/${encodeURIComponent(
        certificateId
      )}`,
      {
        transactionHash,
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
// GET CERTIFICATE HASH FOR METAMASK
// =================================

export const getCertificateHash = async (
  certificateId
) => {
  const token = sessionStorage.getItem(
    "employerToken"
  );

  const response = await api.get(
    `/certificates/hash/${encodeURIComponent(
      certificateId
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =================================
// GET EMPLOYER CERTIFICATES
// =================================

export const getEmployerCertificates =
  async () => {
    const token = sessionStorage.getItem(
      "employerToken"
    );

    const response = await api.get(
      "/certificates/employer",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };


// =================================
// GET WORKER CERTIFICATES
// =================================

export const getWorkerCertificates =
  async () => {
    const token = sessionStorage.getItem(
      "token"
    );

    const response = await api.get(
      "/certificates/worker",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };


// =================================
// VERIFY CERTIFICATE
// =================================

export const verifyCertificate = async (
  certificateId
) => {
  const response = await api.get(
    `/certificates/verify/${encodeURIComponent(
      certificateId
    )}`
  );

  return response.data;
};


// =================================
// SYNC CERTIFICATE WITH BLOCKCHAIN
// =================================

export const syncCertificateWithBlockchain = async (
  certificateId
) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    `/certificates/sync/${encodeURIComponent(certificateId)}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};