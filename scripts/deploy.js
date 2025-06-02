const { ethers } = require("hardhat");

async function main() {
  const DAOFactory = await ethers.getContractFactory("PrivacyVotingDAO");
  const dao = await DAOFactory.deploy(); // deploy() mengirimkan transaksi
  await dao.deployed(); // tunggu hingga transaksi mining selesai
  console.log("DAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
