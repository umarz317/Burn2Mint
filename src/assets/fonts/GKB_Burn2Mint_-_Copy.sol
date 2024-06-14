// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract GkbBurnToMint is ReentrancyGuard {
    using SafeMath for uint256;

/*
     GKB address
*/
    ERC20 public gkb;

/*
    Burn wallet & deadline settings
*/
    address public burn = 0x000000000000000000000000000000000000dEaD;
    uint256 public deadline;
    uint256 public minted;

/*
    Minterinfo
*/
    struct Minter{
        address minter;
        uint256 amount;
    }
    mapping(address=>Minter) public mintedTokens;
    address[] public minters;

    constructor(ERC20 _gkb) {
    gkb = _gkb;
    deadline = block.timestamp.add(7 days);
    }

/*
    Burn To Mint function
*/

    function burnToMint(uint256 _amount) external nonReentrant {
        require(block.timestamp < deadline, "Contract is no longer enabled");
        require(_amount > 0, "Greater than 0");
        require(gkb.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(gkb.allowance(msg.sender, address(this)) >= _amount, "Allowance not set");
        require(gkb.transferFrom(msg.sender, burn, _amount),"Burn failed");

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

}





