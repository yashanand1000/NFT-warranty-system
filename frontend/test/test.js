const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyNFT', function () {
  it('Should mint and transfer an NFT to someone', async function () {
    const [owner1, owner2] = await ethers.getSigners();

    const PyDO = await ethers.getContractFactory('pydo');
    const pydo = await PyDO.deploy();
    await pydo.deployed();

    const smartContractAddress = pydo.address;
    const metadataURI = 'images/google.png';

    console.log(`Smart Contract Address: ${smartContractAddress}`);
    console.log(`Owner1 Address: ${owner1.address}`);
    console.log(`Owner2 Address: ${owner2.address}`);

    let balance = await pydo.balanceOf(owner1.address);
    expect(balance).to.equal(0);

    const newlyMintedToken = await pydo.payToMint(owner1.address, metadataURI);

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await pydo.balanceOf(owner1.address);
    expect(balance).to.equal(1);

    console.log('minted the token');

    await pydo.approveTransfer(
      owner2.address,
      newlyMintedToken.transactionIndex
    );

    console.log('approved the transfer');

    // balance = await pydo.balanceOf(smartContractAddress);
    // expect(balance).to.equal(1);

    expect(await pydo.isContentOwned(metadataURI)).to.equal(true);

    // const transfer_to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

    console.log('transferring the token');

    await pydo
      .connect(owner2)
      .transferNFT(
        owner1.address,
        owner2.address,
        newlyMintedToken.transactionIndex
      );

    balance = await pydo.balanceOf(owner1.address);
    expect(balance).to.equal(0);

    balance = await pydo.balanceOf(owner2.address);
    expect(balance).to.equal(1);
  });
});
