require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

const abiPath =
  "./artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json";
const contractJson = JSON.parse(fs.readFileSync(abiPath));
const abi = contractJson.abi;

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "Harap isi semua variabel .env: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS"
  );
}

async function openVoting(proposalId) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  try {
    const tx = await contract.openVoting(proposalId);
    console.log(`Membuka voting proposal #${proposalId}...`);
    await tx.wait();
    console.log("Voting dibuka!");
  } catch (err) {
    console.error("Gagal membuka voting:", err.reason || err.message);
  }
}

// Ganti proposalId sesuai yang mau dibuka votenya
const proposalId = 0;
openVoting(proposalId);
