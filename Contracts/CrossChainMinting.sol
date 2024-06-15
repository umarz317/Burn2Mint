// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IGKB is IERC20 {
    function burn(address from, uint256 amount) external;

    function transferOwnership(address newOwner) external;
}

contract CrossChainMinting is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    IGKB public token;
    uint256 public burnDeadline;
    uint256 public totalBurned;

    struct Burner {
        address userAddress;
        uint256 burnedAmount;
    }

    mapping(address => Burner) private userBurnData;
    address[] private burners;

    event BurnDeadlineExtended(uint256 additionalTime);
    event BurnDeadlineDecreased(uint256 reduceTime);
    event TokensBurned(address indexed burner, uint256 amount);

    constructor(IGKB _token) Ownable(msg.sender) {
        token = _token;
        burnDeadline = block.timestamp.add(14 days);
    }

    function extendBurnDeadline(uint256 _additionalTime) external onlyOwner {
        burnDeadline = burnDeadline.add(_additionalTime);
        emit BurnDeadlineExtended(_additionalTime);
    }

    function decreaseBurnDeadline(uint256 _reduceTime) external onlyOwner {
        burnDeadline = burnDeadline.sub(_reduceTime);
        emit BurnDeadlineDecreased(_reduceTime);
    }

    function burnTokens(uint256 _amount) external nonReentrant {
        require(
            block.timestamp < burnDeadline,
            "Contract is no longer enabled"
        );
        require(_amount > 0, "Amount must be greater than 0");

        token.burn(msg.sender, _amount);

        if (userBurnData[msg.sender].burnedAmount == 0) {
            burners.push(msg.sender);
        }
        userBurnData[msg.sender].burnedAmount = userBurnData[msg.sender]
            .burnedAmount
            .add(_amount);
        totalBurned = totalBurned.add(_amount);
        emit TokensBurned(msg.sender, _amount);
    }

    function getBurnersCount() external view returns (uint256) {
        return burners.length;
    }

    function transferTokenOwnership(address _newOwner) external onlyOwner {
        token.transferOwnership(_newOwner);
    }

    function getAllBurners() external view returns (Burner[] memory burnersData) {
        burnersData = new Burner[](burners.length);
        for (uint i = 0; i < burners.length; i++) {
            burnersData[i] = userBurnData[burners[i]];
        }
    }

    function getBurnerData(address burner) external view returns (Burner memory) {
        return userBurnData[burner];
    }

    function getAllBurnersAddresses() external view returns (address[] memory) {
        return burners;
    }
}
