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


// =================================
// REGISTER CERTIFICATE DIRECT ON BLOCKCHAIN
// =================================

export const registerCertificateDirectOnBlockchain = async (
  certificateId
) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    `/certificates/register-blockchain/${encodeURIComponent(certificateId)}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =================================
// DOWNLOAD ENCRYPTED IPFS CERTIFICATE (AUTHENTICATED)
// =================================

export const downloadEncryptedCertificatePdf = async (certificateId) => {
  const token =
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("employerToken");

  if (!token) {
    throw new Error(
      "Authentication required to download encrypted certificate from IPFS."
    );
  }

  const response = await api.get(
    `/certificates/download-ipfs/${encodeURIComponent(certificateId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};

// =================================
// RETRY IPFS UPLOAD
// =================================

export const retryCertificateIpfsUpload = async (certificateId) => {
  const token = sessionStorage.getItem("employerToken");

  const response = await api.post(
    `/certificates/retry-ipfs/${encodeURIComponent(certificateId)}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
