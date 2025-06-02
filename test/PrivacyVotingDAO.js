const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyVotingDAO", () => {
  let dao;
  beforeEach(async () => {
    const DAO = await ethers.getContractFactory("PrivacyVotingDAO");
    dao = await DAO.deploy();
    await dao.deployed();
  });

  it("creates proposal and tallies", async () => {
    await dao.createProposal(
      "Test",
      "Should we do X?",
      0, // Binary
      ["Yes", "No"]
    );
    const pId = 1;
    const nullifier = ethers.keccak256(ethers.toUtf8Bytes("secret"));
    await dao.vote(pId, nullifier, 0, "0x");
    const tallies = await dao.tallies(pId);
    expect(tallies[0]).to.equal(1);
  });
});
