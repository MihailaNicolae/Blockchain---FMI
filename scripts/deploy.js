require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy PropertyRegistry
    let PropertyOwnershipRegistry = await ethers.getContractFactory("PropertyOwnershipRegistry");
    let propertyOwnershipRegistry = await PropertyOwnershipRegistry.deploy();

    

    await propertyOwnershipRegistry.deployed();
    console.log("PropertyOwnershipRegistry address: ", propertyOwnershipRegistry.address)

}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });