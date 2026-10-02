// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract VeriWorkCertificate {
    address public owner;
    mapping(address => bool) public authorizedIssuers;

    struct Certificate {
        string certificateId;
        bytes32 certificateHash;
        address registeredBy;
        uint256 registeredAt;
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    event CertificateRegistered(
        string certificateId,
        bytes32 certificateHash,
        address registeredBy,
        uint256 registeredAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            msg.sender == owner || authorizedIssuers[msg.sender],
            "Unauthorized: Only authorized issuers can register certificates"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAdded(msg.sender);
    }

    function addIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Issuer already authorized");
        authorizedIssuers[issuer] = true;
        emit IssuerAdded(issuer);
    }

    function removeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer not authorized");
        require(issuer != owner, "Cannot remove contract owner as issuer");
        authorizedIssuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    function isIssuer(address account) external view returns (bool) {
        return account == owner || authorizedIssuers[account];
    }

    function registerCertificate(
        string memory certificateId,
        bytes32 certificateHash
    ) public onlyAuthorizedIssuer {
        require(
            bytes(certificateId).length > 0,
            "Certificate ID is required"
        );

        require(
            certificateHash != bytes32(0),
            "Certificate hash is required"
        );

        require(
            !certificates[certificateId].exists,
            "Certificate already registered"
        );

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            certificateHash: certificateHash,
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            exists: true
        });

        emit CertificateRegistered(
            certificateId,
            certificateHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyCertificate(
        string memory certificateId,
        bytes32 certificateHash
    ) public view returns (bool) {
        Certificate memory certificate =
            certificates[certificateId];

        if (!certificate.exists) {
            return false;
        }

        return certificate.certificateHash == certificateHash;
    }

    function getCertificate(
        string memory certificateId
    )
        public
        view
        returns (
            string memory,
            bytes32,
            address,
            uint256,
            bool
        )
    {
        Certificate memory certificate =
            certificates[certificateId];

        require(
            certificate.exists,
            "Certificate not found"
        );

        return (
            certificate.certificateId,
            certificate.certificateHash,
            certificate.registeredBy,
            certificate.registeredAt,
            certificate.exists
        );
    }
}