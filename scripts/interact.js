require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();


    let propertyOwnershipRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    let propertyOwnershipRegistry = await ethers.getContractAt("PropertyOwnershipRegistry", propertyOwnershipRegistryAddress);


    //let count = await propertyOwnershipRegistry.getPropertyCount();

    //console.log(count);

    try {
        // Call the contract method
        const count = await propertyOwnershipRegistry.getPropertyCount();
        console.log("Property Count: ", count.toString());
      } catch (error) {
        console.error("Error: ", error);
      }


    console.log("Successful!");

}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });