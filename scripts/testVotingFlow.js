const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

const abi =
  require("../artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json").abi;

const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "❌ Harap isi semua variabel .env: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS"
  );
}

async function testVotingFlow() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  // 1. Buat proposal
  console.log("📝 Membuat proposal...");
  const title = "Uji Voting Anonymous";
  const description =
    "Testing flow voting anonymous dari createProposal sampai vote";
  const proposalType = 0; // 0 = Binary (Yes/No)
  const options = ["Yes", "No"];

  const txCreate = await contract.createProposal(
    title,
    description,
    proposalType,
    options
  );
  const receiptCreate = await txCreate.wait();
  const eventCreate = receiptCreate.events.find(
    (e) => e.event === "ProposalCreated"
  );
  const proposalId = eventCreate.args.id.toNumber();
  console.log(`✅ Proposal berhasil dibuat dengan ID: ${proposalId}`);

  // 2. Vote untuk proposal itu
  // Simulasi voter dengan secret unik (nullifier)
  const secret = "secret123";
  const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
  const optionIdx = 0; // pilih "Yes"
  // Dummy proof (harusnya real zkSNARK proof)
  const proof = "0x00";

  console.log("🚀 Mengirim vote...");
  try {
    const txVote = await contract.vote(proposalId, nullifier, optionIdx, proof);
    await txVote.wait();
    console.log("🎉 Vote berhasil!");
  } catch (err) {
    console.error("❌ Gagal voting:", err.reason || err.message);
  }

  // 3. Tutup voting (close proposal)
  try {
    console.log(`🔒 Menutup voting untuk proposal ID: ${proposalId}`);
    const txClose = await contract.closeProposal(proposalId);
    await txClose.wait();
    console.log("✅ Voting ditutup.");
  } catch (err) {
    console.error("❌ Gagal menutup voting:", err.reason || err.message);
  }

  // 4. Cek hasil tally
  try {
    const tallies = await contract.tallies(proposalId);
    console.log(
      "📊 Hasil tally:",
      tallies.map((v, i) => `${options[i]}: ${v}`).join(", ")
    );
  } catch (err) {
    console.error("❌ Gagal mengambil tally:", err.message);
  }
}

testVotingFlow();
