// scripts/createProposal.js
const { ethers } = require("ethers");
require("dotenv").config();
const abi =
  require("../artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json").abi;

async function createProposal() {
  const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error(
      "❌ Harap isi semua variabel .env: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS"
    );
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  // Randomly pick a proposal type
  const isBinary = Math.random() < 0.5; // 50% chance
  const proposalType = isBinary ? 0 : 1; // 0 = Binary, 1 = Multiple
  const title = isBinary
    ? "Proposal Voting Yes/No"
    : "Proposal Voting Multiple Choice";
  const description = isBinary
    ? "Pilih Ya atau Tidak"
    : "Pilih salah satu dari beberapa opsi";

  const options = isBinary
    ? ["Yes", "No"]
    : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"]; // bisa disesuaikan

  console.log("📝 Membuat proposal...");
  console.log({ title, proposalType, options });

  const tx = await contract.createProposal(
    title,
    description,
    proposalType,
    options
  );
  const receipt = await tx.wait();

  const event = receipt.events.find((e) => e.event === "ProposalCreated");
  const proposalId = event.args.id.toString();

  console.log(`✅ Proposal berhasil dibuat. ID: ${proposalId}`);
  console.log(`🔓 Voting langsung terbuka untuk proposal ini.`);
}

createProposal().catch((err) => {
  console.error("❌ Gagal membuat proposal:", err.message);
});
