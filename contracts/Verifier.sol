// SPDX‑License‑Identifier: Public Domain
pragma solidity ^0.8.24;
/**
* @dev Replace this contract with the real Groth16 verifier generated
by
* SnarkJS (or use Semaphore's pre‑made verifier) once your circuit is
* ready. For tutorial purposes it simply returns true.
*/
contract Verifier {
    function verifyProof(
        bytes calldata /*proof*/,
        bytes32 /*nullifier*/
    ) public pure returns (bool) {
        return true;
    }
}
