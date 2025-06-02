const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyVotingDAO", () => {
  let dao;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory("PrivacyVotingDAO");

    console.log("🚀 Deploying contract...");
    dao = await DAO.deploy();
    await dao.deployed();
    console.log("✅ Deployed at:", dao.address);
  });

  it("creates a binary proposal and performs anonymous vote", async () => {
    console.log("📝 Creating binary proposal...");
    await dao.createProposal(
      "Test Proposal",
      "Should we adopt X?",
      0, // Binary
      ["Yes", "No"]
    );

    const proposalId = 1;
    const secret = "my-voter-secret";
    const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
    const dummyProof = "0x";

    console.log("🔏 Casting anonymous vote...");
    await dao.vote(proposalId, nullifier, 0, dummyProof); // Vote "Yes"

    const tallies = await dao.tallies(proposalId);
    console.log(
      "📊 Tallies:",
      tallies.map((t) => t.toString())
    );
    expect(tallies[0]).to.equal(1); // Yes
    expect(tallies[1]).to.equal(0); // No
  });

  it("prevents double voting with the same nullifier", async () => {
    console.log("📝 Creating proposal to test double voting...");
    await dao.createProposal("Test", "Desc", 0, ["Yes", "No"]);
    const proposalId = 1;
    const nullifier = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("duplicate-voter")
    );
    const dummyProof = "0x";

    console.log("🗳️ First vote...");
    await dao.vote(proposalId, nullifier, 0, dummyProof);

    console.log("🚫 Trying second vote with same nullifier...");
    await expect(
      dao.vote(proposalId, nullifier, 1, dummyProof)
    ).to.be.revertedWith("already voted");
  });

  it("allows multiple-choice voting", async () => {
    console.log("📝 Creating multiple-choice proposal...");
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

    console.log("🗳️ Voting for option 'Green'...");
    await dao.vote(proposalId, nullifier, 2, dummyProof); // Green

    const tallies = await dao.tallies(proposalId);
    console.log(
      "📊 Tallies:",
      tallies.map((t) => t.toString())
    );
    expect(tallies[0]).to.equal(0); // Red
    expect(tallies[1]).to.equal(0); // Blue
    expect(tallies[2]).to.equal(1); // Green
  });
});
