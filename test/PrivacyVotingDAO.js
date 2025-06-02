const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyVotingDAO", () => {
  let dao;

  beforeEach(async () => {
    const DAO = await ethers.getContractFactory("PrivacyVotingDAO");
    dao = await DAO.deploy();
    await dao.deployed(); // ✅ Gunakan ini di Ethers v5
  });

  it("creates proposal and tallies", async () => {
    await dao.createProposal(
      "Test",
      "Should we do X?",
      0, // Binary
      ["Yes", "No"]
    );

    const pId = 1;
    const nullifier = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("secret")
    ); // ✅ Gunakan ethers.utils
    await dao.vote(pId, nullifier, 0, "0x"); // Gunakan dummy proof
    const tallies = await dao.tallies(pId);
    expect(tallies[0]).to.equal(1);
  });
});
