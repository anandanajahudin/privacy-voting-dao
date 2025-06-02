const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyVotingDAO", () => {
  let dao;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory("PrivacyVotingDAO");
    dao = await DAO.deploy();
    await dao.deployed(); // ✅ Ethers.js v5
  });

  it("creates a binary proposal and performs anonymous vote", async () => {
    await dao.createProposal(
      "Test Proposal",
      "Should we adopt X?",
      0, // Binary
      ["Yes", "No"]
    );

    const proposalId = 1;
    const secret = "my-voter-secret";
    const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret)); // ✅ Gunakan ethers.utils untuk Ethers v5

    const dummyProof = "0x";

    await dao.vote(proposalId, nullifier, 0, dummyProof);

    const tallies = await dao.tallies(proposalId);
    expect(tallies[0]).to.equal(1); // Yes
    expect(tallies[1]).to.equal(0); // No
  });

  it("prevents double voting with the same nullifier", async () => {
    await dao.createProposal("Test", "Desc", 0, ["Yes", "No"]);
    const proposalId = 1;
    const nullifier = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("duplicate-voter")
    );
    const dummyProof = "0x";

    await dao.vote(proposalId, nullifier, 0, dummyProof);
    await expect(
      dao.vote(proposalId, nullifier, 1, dummyProof)
    ).to.be.revertedWith("already voted");
  });

  it("allows multiple-choice voting", async () => {
    await dao.createProposal("MC Test", "Choose one", 1, [
      "Red",
      "Blue",
      "Green",
    ]);
    const proposalId = 1;
    const nullifier = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("multi-voter")
    );
    const dummyProof = "0x";

    await dao.vote(proposalId, nullifier, 2, dummyProof); // Green

    const tallies = await dao.tallies(proposalId);
    expect(tallies[0]).to.equal(0); // Red
    expect(tallies[1]).to.equal(0); // Blue
    expect(tallies[2]).to.equal(1); // Green
  });
});
