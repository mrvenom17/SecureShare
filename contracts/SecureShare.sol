// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SecureShare
 * @dev Smart contract for secure file sharing with access control
 */
contract SecureShare is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _fileIds;
    
    struct FileRecord {
        bytes32 fileId;
        address owner;
        string ipfsHash;
        uint256 timestamp;
        bool exists;
        mapping(address => bool) accessList;
        address[] accessUsers;
    }
    
    mapping(bytes32 => FileRecord) private files;
    mapping(address => bytes32[]) private userFiles;
    mapping(address => bytes32[]) private userAccessFiles;
    
    // Events
    event FileUploaded(
        address indexed owner,
        bytes32 indexed fileId,
        string ipfsHash,
        uint256 timestamp
    );
    
    event AccessGranted(
        address indexed owner,
        address indexed user,
        bytes32 indexed fileId
    );
    
    event AccessRevoked(
        address indexed owner,
        address indexed user,
        bytes32 indexed fileId
    );
    
    // Modifiers
    modifier onlyFileOwner(bytes32 fileId) {
        require(files[fileId].exists, "File does not exist");
        require(files[fileId].owner == msg.sender, "Not file owner");
        _;
    }
    
    modifier fileExists(bytes32 fileId) {
        require(files[fileId].exists, "File does not exist");
        _;
    }
    
    /**
     * @dev Upload a new file to the system
     * @param fileId Unique identifier for the file
     * @param ipfsHash IPFS hash of the encrypted file
     */
    function uploadFile(bytes32 fileId, string memory ipfsHash) 
        external 
        nonReentrant 
    {
        require(!files[fileId].exists, "File already exists");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        FileRecord storage newFile = files[fileId];
        newFile.fileId = fileId;
        newFile.owner = msg.sender;
        newFile.ipfsHash = ipfsHash;
        newFile.timestamp = block.timestamp;
        newFile.exists = true;
        
        userFiles[msg.sender].push(fileId);
        _fileIds.increment();
        
        emit FileUploaded(msg.sender, fileId, ipfsHash, block.timestamp);
    }
    
    /**
     * @dev Grant access to a file for a specific user
     * @param fileId The file identifier
     * @param user Address to grant access to
     */
    function grantAccess(bytes32 fileId, address user) 
        external 
        onlyFileOwner(fileId) 
    {
        require(user != address(0), "Invalid user address");
        require(user != msg.sender, "Cannot grant access to yourself");
        require(!files[fileId].accessList[user], "Access already granted");
        
        files[fileId].accessList[user] = true;
        files[fileId].accessUsers.push(user);
        userAccessFiles[user].push(fileId);
        
        emit AccessGranted(msg.sender, user, fileId);
    }
    
    /**
     * @dev Revoke access to a file for a specific user
     * @param fileId The file identifier
     * @param user Address to revoke access from
     */
    function revokeAccess(bytes32 fileId, address user) 
        external 
        onlyFileOwner(fileId) 
    {
        require(files[fileId].accessList[user], "Access not granted");
        
        files[fileId].accessList[user] = false;
        
        // Remove from accessUsers array
        address[] storage accessUsers = files[fileId].accessUsers;
        for (uint i = 0; i < accessUsers.length; i++) {
            if (accessUsers[i] == user) {
                accessUsers[i] = accessUsers[accessUsers.length - 1];
                accessUsers.pop();
                break;
            }
        }
        
        // Remove from userAccessFiles array
        bytes32[] storage userAccess = userAccessFiles[user];
        for (uint i = 0; i < userAccess.length; i++) {
            if (userAccess[i] == fileId) {
                userAccess[i] = userAccess[userAccess.length - 1];
                userAccess.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, user, fileId);
    }
    
    /**
     * @dev Check if a user has access to a file
     * @param fileId The file identifier
     * @param user Address to check access for
     * @return bool True if user has access
     */
    function hasAccess(bytes32 fileId, address user) 
        external 
        view 
        fileExists(fileId) 
        returns (bool) 
    {
        return files[fileId].owner == user || files[fileId].accessList[user];
    }
    
    /**
     * @dev Get file information
     * @param fileId The file identifier
     * @return owner File owner address
     * @return ipfsHash IPFS hash of the file
     * @return timestamp Upload timestamp
     */
    function getFileInfo(bytes32 fileId) 
        external 
        view 
        fileExists(fileId) 
        returns (address owner, string memory ipfsHash, uint256 timestamp) 
    {
        require(
            files[fileId].owner == msg.sender || files[fileId].accessList[msg.sender],
            "No access to file"
        );
        
        FileRecord storage file = files[fileId];
        return (file.owner, file.ipfsHash, file.timestamp);
    }
    
    /**
     * @dev Get files owned by a user
     * @param user User address
     * @return Array of file IDs
     */
    function getUserFiles(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userFiles[user];
    }
    
    /**
     * @dev Get files a user has access to
     * @param user User address
     * @return Array of file IDs
     */
    function getUserAccessFiles(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userAccessFiles[user];
    }
    
    /**
     * @dev Get users who have access to a file
     * @param fileId The file identifier
     * @return Array of user addresses
     */
    function getFileAccessUsers(bytes32 fileId) 
        external 
        view 
        onlyFileOwner(fileId) 
        returns (address[] memory) 
    {
        return files[fileId].accessUsers;
    }
    
    /**
     * @dev Get total number of files in the system
     * @return Total file count
     */
    function getTotalFiles() external view returns (uint256) {
        return _fileIds.current();
    }
    
    /**
     * @dev Emergency function to pause contract (only owner)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause if needed
        // This could disable certain functions in case of security issues
    }
}