// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.0 <0.9.0;

contract PropertyRegistry {
    struct Property {
        address owner;
        string location;
        uint value;
    }

    mapping(uint => Property) public properties;

    event PropertyTransferred(uint indexed id, address indexed from, address indexed to);

    function transferProperty(uint id, address to) public {
        Property storage property = properties[id];
        require(property.owner == msg.sender, "You are not the owner of this property");
        property.owner = to;
        emit PropertyTransferred(id, msg.sender, to);
    }
}