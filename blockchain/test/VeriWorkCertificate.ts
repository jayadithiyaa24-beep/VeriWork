import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("VeriWorkCertificate", function () {
  async function deployContract() {
    const VeriWorkCertificate =
      await ethers.getContractFactory(
        "VeriWorkCertificate"
      );

    const contract =
      await VeriWorkCertificate.deploy();

    return contract;
  }

  it("should register a certificate by contract owner", async function () {
    const contract = await deployContract();

    const certificateId =
      "VW-CERT-2026-A1B2C3D4";

    const certificateHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "sample-certificate-data"
        )
      );

    await contract.registerCertificate(
      certificateId,
      certificateHash
    );

    const certificate =
      await contract.getCertificate(
        certificateId
      );

    expect(certificate[0]).to.equal(
      certificateId
    );

    expect(certificate[1]).to.equal(
      certificateHash
    );

    expect(certificate[4]).to.equal(true);
  });

  it("should verify a certificate with the correct hash", async function () {
    const contract = await deployContract();

    const certificateId =
      "VW-CERT-2026-B2C3D4E5";

    const certificateHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "another-certificate"
        )
      );

    await contract.registerCertificate(
      certificateId,
      certificateHash
    );

    const result =
      await contract.verifyCertificate(
        certificateId,
        certificateHash
      );

    expect(result).to.equal(true);
  });

  it("should reject an incorrect certificate hash", async function () {
    const contract = await deployContract();

    const certificateId =
      "VW-CERT-2026-C3D4E5F6";

    const correctHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "correct-certificate"
        )
      );

    const incorrectHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "incorrect-certificate"
        )
      );

    await contract.registerCertificate(
      certificateId,
      correctHash
    );

    const result =
      await contract.verifyCertificate(
        certificateId,
        incorrectHash
      );

    expect(result).to.equal(false);
  });

  it("should prevent duplicate certificate registration", async function () {
    const contract = await deployContract();

    const certificateId =
      "VW-CERT-2026-D4E5F6A7";

    const certificateHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "duplicate-test"
        )
      );

    await contract.registerCertificate(
      certificateId,
      certificateHash
    );

    await expect(
      contract.registerCertificate(
        certificateId,
        certificateHash
      )
    ).to.be.revertedWith(
      "Certificate already registered"
    );
  });

  it("should reject an empty certificate ID", async function () {
    const contract = await deployContract();

    const certificateHash =
      ethers.keccak256(
        ethers.toUtf8Bytes(
          "empty-id-test"
        )
      );

    await expect(
      contract.registerCertificate(
        "",
        certificateHash
      )
    ).to.be.revertedWith(
      "Certificate ID is required"
    );
  });

  // =========================================
  // ACCESS CONTROL TESTS
  // =========================================

  it("should reject registration from an unauthorized wallet", async function () {
    const signers = await ethers.getSigners();
    const unauthorizedUser = signers[1];

    const contract = await deployContract();

    const certificateId = "VW-CERT-UNAUTH-01";
    const certificateHash = ethers.keccak256(
      ethers.toUtf8Bytes("unauthorized-test")
    );

    await expect(
      contract.connect(unauthorizedUser).registerCertificate(
        certificateId,
        certificateHash
      )
    ).to.be.revertedWith(
      "Unauthorized: Only authorized issuers can register certificates"
    );
  });

  it("should allow owner to add an issuer and permit them to register certificates", async function () {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const employerWallet = signers[2];

    const contract = await deployContract();

    expect(await contract.isIssuer(employerWallet.address)).to.equal(false);

    // Owner authorizes employer
    await contract.connect(owner).addIssuer(employerWallet.address);
    expect(await contract.isIssuer(employerWallet.address)).to.equal(true);

    // Authorized employer registers certificate
    const certificateId = "VW-CERT-ISSUER-01";
    const certificateHash = ethers.keccak256(
      ethers.toUtf8Bytes("employer-issued-cert")
    );

    await contract.connect(employerWallet).registerCertificate(
      certificateId,
      certificateHash
    );

    const onChainCert = await contract.getCertificate(certificateId);
    expect(onChainCert[0]).to.equal(certificateId);
    expect(onChainCert[2]).to.equal(employerWallet.address);
  });

  it("should prevent non-owners from adding issuers", async function () {
    const signers = await ethers.getSigners();
    const nonOwner = signers[3];
    const randomAddress = signers[4];

    const contract = await deployContract();

    await expect(
      contract.connect(nonOwner).addIssuer(randomAddress.address)
    ).to.be.revertedWith(
      "Only contract owner can perform this action"
    );
  });

  it("should allow owner to remove an authorized issuer", async function () {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const employerWallet = signers[5];

    const contract = await deployContract();

    await contract.connect(owner).addIssuer(employerWallet.address);
    expect(await contract.isIssuer(employerWallet.address)).to.equal(true);

    // Remove issuer
    await contract.connect(owner).removeIssuer(employerWallet.address);
    expect(await contract.isIssuer(employerWallet.address)).to.equal(false);

    // Attempt to register after revocation
    const certificateId = "VW-CERT-REVOKED-01";
    const certificateHash = ethers.keccak256(
      ethers.toUtf8Bytes("revoked-test")
    );

    await expect(
      contract.connect(employerWallet).registerCertificate(
        certificateId,
        certificateHash
      )
    ).to.be.revertedWith(
      "Unauthorized: Only authorized issuers can register certificates"
    );
  });
});