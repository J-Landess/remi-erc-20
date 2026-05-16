const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Remi", function () {
  const TOTAL_SUPPLY = 100_000_000n * 10n ** 18n;

  async function deployRemi() {
    const [owner, alice, bob] = await ethers.getSigners();
    const Remi = await ethers.getContractFactory("Remi");
    const remi = await Remi.deploy(owner.address);
    await remi.waitForDeployment();
    return { remi, owner, alice, bob };
  }

  it("mints fixed supply to deployer and sets deployer as owner", async function () {
    const { remi, owner } = await deployRemi();
    expect(await remi.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    expect(await remi.totalSupply()).to.equal(TOTAL_SUPPLY);
    expect(await remi.owner()).to.equal(owner.address);
    expect(await remi.name()).to.equal("Remi");
    expect(await remi.symbol()).to.equal("REMI");
    expect(await remi.decimals()).to.equal(18);
  });

  it("allows owner to burn their own tokens", async function () {
    const { remi, owner } = await deployRemi();
    const burnAmount = ethers.parseEther("1000");
    await expect(remi.connect(owner).burn(burnAmount))
      .to.emit(remi, "Transfer")
      .withArgs(owner.address, ethers.ZeroAddress, burnAmount);
    expect(await remi.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY - burnAmount);
    expect(await remi.totalSupply()).to.equal(TOTAL_SUPPLY - burnAmount);
  });

  it("allows owner to force-burn from any address", async function () {
    const { remi, owner, alice } = await deployRemi();
    const transferAmount = ethers.parseEther("5000");
    await remi.connect(owner).transfer(alice.address, transferAmount);

    const forceBurnAmount = ethers.parseEther("1000");
    await expect(remi.connect(owner).forceBurn(alice.address, forceBurnAmount))
      .to.emit(remi, "Transfer")
      .withArgs(alice.address, ethers.ZeroAddress, forceBurnAmount);

    expect(await remi.balanceOf(alice.address)).to.equal(transferAmount - forceBurnAmount);
    expect(await remi.totalSupply()).to.equal(TOTAL_SUPPLY - forceBurnAmount);
  });

  it("reverts when non-owner tries burn or forceBurn", async function () {
    const { remi, alice } = await deployRemi();
    const amount = ethers.parseEther("1");
    await expect(remi.connect(alice).burn(amount)).to.be.revertedWithCustomError(
      remi,
      "OwnableUnauthorizedAccount"
    );
    await expect(
      remi.connect(alice).forceBurn(alice.address, amount)
    ).to.be.revertedWithCustomError(remi, "OwnableUnauthorizedAccount");
  });
});
