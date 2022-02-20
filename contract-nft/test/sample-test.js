const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should mint and transfer an NFT to someoene", async function () {
    const Sigils = await ethers.getContractFactory("Sigils");
    const sigils = await Sigils.deploy();
    await sigils.deployed();

    const recipient = '0xdd2fd4581271e230360230f9337d5c0430bf44c0' 
    const metadataURI = 'cid/test.png';

    // wait until the transaction is mined
    const balance = await sigils.balanceOf(recipient);
    expect(balance).to.equal(0)

    const newlyMintedToken = await sigils.payToMint(
      recipient,
      metadataURI,
      {
        value: ethers.utils.parseEther('0.05')
      }
    )
  });
});
