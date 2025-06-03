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

  // 1. Buat proposal secara acak
  const isBinary = Math.random() < 0.5;
  const proposalType = isBinary ? 0 : 1;
  const title = isBinary ? "Uji Voting Yes/No" : "Uji Voting Multiple Choice";
  const description = isBinary
    ? "Pilih Ya atau Tidak"
    : "Pilih salah satu dari beberapa opsi";

  const options = isBinary
    ? ["Yes", "No"]
    : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"];

  console.log("📝 Membuat proposal...");
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

  // 2. Simulasi anonymous vote
  const secret = "secret" + Math.floor(Math.random() * 100000);
  const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
  const optionIdx = Math.floor(Math.random() * options.length); // random pilihan
  const proof = "0x1234"; // dummy proof (ganti jika pakai ZKP beneran)

  console.log(`🚀 Mengirim vote (pilihan: ${options[optionIdx]})...`);
  try {
    const txVote = await contract.vote(proposalId, nullifier, optionIdx, proof);
    await txVote.wait();
    console.log("🎉 Vote berhasil!");
  } catch (err) {
    console.error("❌ Gagal voting:", err.reason || err.message);
  }

  // 3. Tutup proposal (hanya pemilik yang bisa)
  try {
    console.log(`🔒 Menutup voting untuk proposal ID: ${proposalId}`);
    const txClose = await contract.closeProposal(proposalId);
    await txClose.wait();
    console.log("✅ Voting ditutup.");
  } catch (err) {
    console.error("❌ Gagal menutup voting:", err.reason || err.message);
  }

  // 4. Ambil hasil akhir tally
  try {
    const tallies = await contract.tallies(proposalId);
    console.log("📊 Hasil tally:");
    tallies.forEach((v, i) => {
      console.log(`   - ${options[i]}: ${v.toString()} suara`);
    });
  } catch (err) {
    console.error("❌ Gagal mengambil tally:", err.message);
  }
}

testVotingFlow();
