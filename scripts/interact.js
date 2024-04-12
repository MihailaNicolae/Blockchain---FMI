require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let propertyRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    let propertyRegistry = await ethers.getContractAt("PropertyRegistry", propertyRegistryAddress);

    console.log("Successful!")


}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });