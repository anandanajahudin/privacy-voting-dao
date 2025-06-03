require("dotenv").config(); // load .env
const { ethers } = require("ethers");
const fs = require("fs");

// 1. Load ABI dari hasil compile Hardhat
const abiPath =
  "./artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json";
const contractJson = JSON.parse(fs.readFileSync(abiPath));
const abi = contractJson.abi;

// 2. Load ENV config
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "Harap isi semua variabel .env: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS"
  );
}

/**
 * Dummy generateProof function.
 * Ganti ini dengan implementasi ZKP-mu sendiri.
 *
 * @param {string} secret - rahasia unik voter
 * @param {number} proposalId - ID proposal yang dipilih
 * @param {number} optionIdx - index opsi pilihan voter
 * @returns {string} hex proof (contoh: '0x1234...')
 */
function generateProof(secret, proposalId, optionIdx) {
  // Dummy logic: proof berupa hash dari gabungan input
  const combined = secret + proposalId.toString() + optionIdx.toString();
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(combined));
}

async function vote() {
  // 3. Setup provider dan signer
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

  // 4. Siapkan data voting
  const proposalId = 0; // Ganti sesuai dengan ID proposal yang aktif
  const optionIdx = 1; // Index opsi (0, 1, 2, dst)
  const secret = "secret123"; // Rahasia unik voter (gunakan yang berbeda untuk tiap user)

  const nullifier = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(secret));
  const proof = generateProof(secret, proposalId, optionIdx);

  console.log("🚀 Mengirim vote...");
  console.log({ proposalId, optionIdx, nullifier, proof });

  try {
    const tx = await contract.vote(proposalId, nullifier, optionIdx, proof);
    console.log("✅ Transaksi dikirim:", tx.hash);
    await tx.wait();
    console.log("🎉 Vote berhasil!");
  } catch (err) {
    console.error("❌ Gagal voting:", err.reason || err.message);
  }
}

vote();
