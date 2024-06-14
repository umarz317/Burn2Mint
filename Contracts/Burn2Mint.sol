// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IGKB is IERC20 {

    function burn(address from, uint256 amount) external; 
    function transferOwnership(address newOwner) external;

}

contract GkbBurnToMint is ReentrancyGuard, Ownable{
    using SafeMath for uint256;

    IGKB public gkb;

    uint256 public deadline;
    uint256 public minted;

    struct Minter{
        address minter;
        uint256 amount;
    }

    mapping(address=>Minter) public mintedTokens;
    address[] public minters;

    constructor(IGKB _gkb) Ownable(msg.sender) {
        gkb = _gkb;
        deadline = block.timestamp.add(14 days);
    }

    function extendDeadline(uint256 _deadline) external onlyOwner {
        deadline = block.timestamp.add(_deadline);
    }

    function decreaseDeadline(uint256 _deadline) external onlyOwner {
        deadline = block.timestamp.sub(_deadline);
    }

    function burnToMint(uint256 _amount) external nonReentrant {
        require(block.timestamp < deadline, "Contract is no longer enabled");
        require(_amount > 0, "Greater than 0");

        gkb.burn(msg.sender,_amount);

        if(mintedTokens[msg.sender].amount==0){
            minters.push(msg.sender);
        }
        mintedTokens[msg.sender].amount = mintedTokens[msg.sender].amount.add(_amount);
        minted = minted.add(_amount);

    } 

    function getMintedAmount(address _user) public view returns(uint256){
        return mintedTokens[_user].amount;
    }

    function getMintersLength() public view returns(uint256){
        return minters.length;
    }

    function transferOwnershipBack(address _newOwner) external onlyOwner {
        gkb.transferOwnership(_newOwner);
    }

}

