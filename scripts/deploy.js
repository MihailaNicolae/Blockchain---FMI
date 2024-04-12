require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy PropertyRegistry
    let PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    let propertyRegistry = await PropertyRegistry.deploy();
    await propertyRegistry.deployed();
    console.log("PropertyRegistry address: ", propertyRegistry.address)

}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });