// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Property {
    address public owner;
    string public name;
    uint public price; // Assuming price is in Wei
    address public propertyAddress;
    address public propertyOwner;

    constructor(string memory _name, uint _price, address ow) {
        owner = msg.sender; // Owner is the one who deploys the contract
        name = _name;
        price = _price;
        propertyAddress = address(this); // Set the property's address
        propertyOwner = ow;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }

    function setPrice(uint _price) external onlyOwner {
        price = _price;
    }

    function getPropertyAddress() external view returns (address) {
        return propertyAddress;
    }

}