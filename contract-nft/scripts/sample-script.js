const hre = require("hardhat");

async function main() {
  const Sigils = await hre.ethers.getContractFactory("Sigils");
  const sigils = await Sigils.deploy();

  await sigils.deployed();

  console.log("My nft deployed to:", sigils.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
