import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VeriWorkCertificateModule = buildModule(
  "VeriWorkCertificateModule",
  (m) => {
    const veriWorkCertificate = m.contract(
      "VeriWorkCertificate"
    );

    return {
      veriWorkCertificate,
    };
  }
);

export default VeriWorkCertificateModule;