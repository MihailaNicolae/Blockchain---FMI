require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1, user2, user4, user5, user6, user7] = await ethers.getSigners();


    let propertyOwnershipRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    let propertyOwnershipRegistry = await ethers.getContractAt("PropertyOwnershipRegistry", propertyOwnershipRegistryAddress);


    //let count = await propertyOwnershipRegistry.getPropertyCount();

    //console.log(count);

    try {
        // Call the contract method
        //const count = await propertyOwnershipRegistry.connect(user7).transferPropertyOwnership('0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e', '0x59Edcbe7f7861a8ed2D051CB26C7393ea84f0dD9');
        const ceva = await propertyOwnershipRegistry.getFormattedPropertyInfo(0);
        console.log("Property Count: ", ceva);
      } catch (error) {
        console.error("Error: ", error);
      }


}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });