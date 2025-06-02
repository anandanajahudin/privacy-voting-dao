import { ethers } from "ethers";
import abi from "../../../../artifacts/contracts/PrivacyVotingDAO.sol/PrivacyVotingDAO.json";

export const CONTRACT_ADDRESS = import.meta.env.VITE_DAO_ADDRESS;
export function getContract() {
  const { ethereum } = window;

  if (!ethereum) throw new Error("MetaMask required");
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = provider.getSigner();
}
return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
