const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RemiToken", function () {
  let remiToken;
  let owner;
  let addr1;
  let addr2;
  const INITIAL_SUPPLY = ethers.utils.parseEther("1000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const RemiToken = await ethers.getContractFactory("RemiToken");
    remiToken = await RemiToken.deploy();
    await remiToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await remiToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await remiToken.balanceOf(owner.address);
      expect(await remiToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await remiToken.name()).to.equal("Remi");
      expect(await remiToken.symbol()).to.equal("REMI");
    });

    it("Should have correct initial supply", async function () {
      const totalSupply = await remiToken.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      
      // Transfer tokens from owner to addr1
      await remiToken.transfer(addr1.address, transferAmount);
      
      const addr1Balance = await remiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const ownerBalance = await remiToken.balanceOf(owner.address);
      const transferAmount = ownerBalance.add(ethers.utils.parseEther("1"));

      await expect(
        remiToken.transfer(addr1.address, transferAmount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.utils.parseEther("100");

      // Transfer from owner to addr1
      await remiToken.transfer(addr1.address, transferAmount);

      // Transfer from addr1 to addr2
      await remiToken.connect(addr1).transfer(addr2.address, transferAmount);

      const addr2Balance = await remiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialSupply = await remiToken.totalSupply();

      await remiToken.burn(burnAmount);

      const newSupply = await remiToken.totalSupply();
      expect(newSupply).to.equal(initialSupply.sub(burnAmount));
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      const initialSupply = await remiToken.totalSupply();

      await remiToken.mint(addr1.address, mintAmount);

      const newSupply = await remiToken.totalSupply();
      expect(newSupply).to.equal(initialSupply.add(mintAmount));

      const addr1Balance = await remiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.utils.parseEther("1000");

      await expect(
        remiToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
