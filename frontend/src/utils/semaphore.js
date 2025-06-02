import { keccak256, toUtf8Bytes } from "ethers";
// *** toy helper – NOT production‑grade ZK ***

export function createVote(secret, proposalId) {
  const nullifier = keccak256(toUtf8Bytes(secret));
  // normally you'd build a full zk proof here; we merely return empty bytes.
  const proof = "0x";
}
