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

  const title = "Uji voting baru";
  const description = "Proposal untuk pengujian sistem voting backend";
  const proposalType = 0; // 0 = Yes/No
  const options = ["Yes", "No"];

  console.log("📝 Membuat proposal...");

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

  // Buka voting setelah proposal dibuat (pastikan fungsi ini ada di smart contract)
  try {
    const openTx = await contract.openVoting(proposalId);
    await openTx.wait();
    console.log(`🚀 Voting untuk proposal #${proposalId} telah dibuka.`);
  } catch (err) {
    console.error("⚠️ Gagal membuka voting:", err.reason || err.message);
  }
}

createProposal().catch((err) => {
  console.error("❌ Gagal membuat proposal:", err.message);
});
