import { ethers } from "hardhat";

async function main() {
  const DAO = await ethers.getContractFactory("PrivacyVotingDAO");
  const dao = await DAO.deploy();
  await dao.deployed();
  console.log("DAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
