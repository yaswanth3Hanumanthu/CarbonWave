// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./BlueCarbonCredits.sol";

contract CarbonRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Project {
        address owner;
        string metadataURI; // IPFS or https
        bytes32 geoHash; // coarse geohash
        bool active;
    }

    struct Verification {
        address verifier;
        uint256 timestamp;
        string evidenceURI;
    }

    BlueCarbonCredits public credits;

    uint256 public nextProjectId = 1;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Verification[]) public projectVerifications;

    event ProjectRegistered(uint256 indexed projectId, address indexed owner, string metadataURI, bytes32 geoHash);
    event ProjectDeactivated(uint256 indexed projectId);
    event Verified(uint256 indexed projectId, address indexed verifier, string evidenceURI);
    event Issued(uint256 indexed projectId, uint256 indexed tokenId, address indexed to, uint256 amount);

    constructor(BlueCarbonCredits _credits, address admin) {
        credits = _credits;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(projects[projectId].owner == msg.sender, "Not project owner");
        _;
    }

    function registerProject(address owner, string memory metadataURI, bytes32 geoHash) external onlyRole(ADMIN_ROLE) returns (uint256) {
        uint256 pid = nextProjectId++;
        projects[pid] = Project({owner: owner, metadataURI: metadataURI, geoHash: geoHash, active: true});
        emit ProjectRegistered(pid, owner, metadataURI, geoHash);
        return pid;
    }

    function deactivateProject(uint256 projectId) external onlyRole(ADMIN_ROLE) {
        projects[projectId].active = false;
        emit ProjectDeactivated(projectId);
    }

    function updateProjectURI(uint256 projectId, string memory metadataURI) external onlyProjectOwner(projectId) {
        projects[projectId].metadataURI = metadataURI;
    }

    function addVerifier(address verifier) external onlyRole(ADMIN_ROLE) {
        _grantRole(VERIFIER_ROLE, verifier);
    }

    function verify(uint256 projectId, string memory evidenceURI) external onlyRole(VERIFIER_ROLE) {
        require(projects[projectId].active, "Inactive");
        projectVerifications[projectId].push(Verification({verifier: msg.sender, timestamp: block.timestamp, evidenceURI: evidenceURI}));
        emit Verified(projectId, msg.sender, evidenceURI);
    }

    // Mint credits to project owner or beneficiary
    function issueCredits(uint256 projectId, uint256 tokenId, address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(projects[projectId].active, "Inactive");
        credits.mint(to, tokenId, amount, "");
        emit Issued(projectId, tokenId, to, amount);
    }
}


