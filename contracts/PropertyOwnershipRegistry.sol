// pragma solidity ^0.8.0;

// import "./Property.sol";

// contract PropertyOwnershipRegistry {
//     struct PropertyInfo {
//         string name;
//         uint price;
//         address propertyAddress;
//         address propertyOwner;
//     }
//     uint public ceva;

//     mapping(address => address) public propertyToOwner;
//     mapping(address => PropertyInfo) public properties;
//     address[] public propertyAddresses;

//     event PropertyRegistered(address indexed propertyAddress);

//     function registerProperty(string memory name, uint price) external {
//         require(bytes(name).length > 0, "Name cannot be empty");
//         Property newProperty = new Property(name, price, msg.sender);
//         address propertyAddress = address(newProperty);
//         propertyToOwner[propertyAddress] = msg.sender;
//         PropertyInfo memory info = PropertyInfo(name, price, propertyAddress, msg.sender);
//         properties[propertyAddress] = info;
//         propertyAddresses.push(propertyAddress);
//         emit PropertyRegistered(propertyAddress); // Emitting the property's address
//     }

//     function transferPropertyOwnership(address propertyAddress, address newOwner) external {
//         require(propertyAddress != address(0), "Invalid property address");
//         require(propertyToOwner[propertyAddress] == msg.sender, "You don't own this property");
//         Property property = Property(propertyAddress);
//         property.transferOwnership(newOwner);
//         propertyToOwner[propertyAddress] = newOwner;
//     }

//     function getPropertyCount() external view returns (uint) {
//         //require(condition, "Revert reason here");
//         return propertyAddresses.length;
//     }

//     function getPropertyInfo(uint index) external view returns (string memory, uint, address, address) {
//         require(index < propertyAddresses.length, "Index out of range");
//         address propertyAddress = propertyAddresses[index];
//         return (properties[propertyAddress].name, properties[propertyAddress].price, propertyAddress, properties[propertyAddress].propertyOwner);
//     }
// }



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Property.sol";
import "./Utils.sol";

contract PropertyOwnershipRegistry {
    using Utils for string;
    using Utils for uint;

    struct PropertyInfo {
        string name;
        uint price;
        address propertyAddress;
    }

    mapping(address => address) public propertyToOwner;
    mapping(address => PropertyInfo) public properties;
    address[] public propertyAddresses;

    event PropertyRegistered(address indexed propertyAddress);
    event OwnershipTransferred(address indexed propertyAddress, address indexed oldOwner, address indexed newOwner);

    function registerProperty(string memory name, uint price) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        Property newProperty = new Property(name, price);
        address propertyAddress = address(newProperty);
        propertyToOwner[propertyAddress] = msg.sender;
        PropertyInfo memory info = PropertyInfo(name, price, propertyAddress);
        properties[propertyAddress] = info;
        propertyAddresses.push(propertyAddress);
        emit PropertyRegistered(propertyAddress); // Emitting the property's address
    }

    function transferPropertyOwnership(address propertyAddress, address newOwner) external payable {
        require(propertyAddress != address(0), "Invalid property address");
        require(propertyToOwner[propertyAddress] == msg.sender, "You don't own this property");
        Property property = Property(propertyAddress);
        uint price = property.price();
        require(msg.value == price, "Price must be paid to transfer the property");

        // Transfer the ownership in the Property contract
        property.transferOwnership(newOwner);

        // Update the registry
        address oldOwner = propertyToOwner[propertyAddress];
        propertyToOwner[propertyAddress] = newOwner;

        // Transfer the price to the old owner
        payable(oldOwner).transfer(msg.value);

        emit OwnershipTransferred(propertyAddress, oldOwner, newOwner);
    }

    function getPropertyCount() external view returns (uint) {
        return propertyAddresses.length;
    }

    function getPropertyInfo(uint index) external view returns (string memory, uint, address) {
        require(index < propertyAddresses.length, "Index out of range");
        address propertyAddress = propertyAddresses[index];
        return (properties[propertyAddress].name, properties[propertyAddress].price, propertyAddress);
    }

    // Example function using Utils library
    function getFormattedPropertyInfo(uint index) external view returns (string memory) {
        require(index < propertyAddresses.length, "Index out of range");
        PropertyInfo memory info = properties[propertyAddresses[index]];
        return info.name.strConcat(" - ").strConcat(info.price.uintToStr());
    }
}
