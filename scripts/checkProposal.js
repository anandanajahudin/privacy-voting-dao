require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const abiPath =
  "./artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json";
const contractJson = JSON.parse(fs.readFileSync(abiPath));
const abi = contractJson.abi;

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !CONTRACT_ADDRESS) {
  throw new Error("Harap isi variabel .env: RPC_URL, CONTRACT_ADDRESS");
}

async function checkProposal(proposalId) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  try {
    const proposal = await contract.proposals(proposalId);
    console.log(`Proposal #${proposalId}:`);
    console.log("Name:", proposal.name);
    console.log("Voting open:", proposal.open);
  } catch (err) {
    console.error("Gagal cek proposal:", err.message);
  }
}

// Ganti proposalId sesuai yang mau dicek
const proposalId = 0;
checkProposal(proposalId);
