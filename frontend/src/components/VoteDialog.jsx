import { useState } from "react";
import { getContract } from "../utils/contract";
import { createVote } from "../utils/semaphore";

export default function VoteDialog({ proposal, onClose }) {
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState(crypto.randomUUID());
    const [choice, setChoice] = useState(0);
    const submit = async () => {
        setLoading(true);
        try {
            const { nullifier, proof } = createVote(secret, proposal.id);
            const dao = getContract();
            const tx = await dao.vote(proposal.id, nullifier, choice, proof);
            await tx.wait();
            localStorage.setItem(`secret_${proposal.id}`, secret); // keep secret so you can later prove participation
            alert("Vote cast ✔");
            onClose();
        } catch (err) { alert(err.message || err); }
            setLoading(false);
    };
    return (
        <div className="fixed inset‑0 bg‑black/40 flex items‑center
        justify‑center z‑50">
            <div className="bg‑white rounded‑2xl p‑6 w‑96">
                <h3 className="text‑lg font‑semibold mb‑4">Vote on “{proposal.title}”</h3>
                <div className="space‑y‑2">
                {proposal.pType == 0
                    ? ["Yes", "No"].map((opt, i) => (
                    <label key={i} className="flex items‑center gap‑2">
                    <input type="radio" name="opt" value={i}
                    checked={choice==i} onChange={()=>setChoice(i)} /> {opt}
                    </label>
                ))
                : proposal.options?.map((opt, i) => (
                    <label key={i} className="flex items‑center gap‑2">
                    <input type="radio" name="opt" value={i}
                    checked={choice==i} onChange={()=>setChoice(i)} /> {opt}
                    </label>
                ))}
            </div>

            <button onClick={submit} disabled={loading} className="mt‑4
                bg‑green‑600 text‑white w‑full py‑2 rounded">
                {loading ? "Submitting…" : "Submit"}
            </button>

            <button onClick={onClose} className="mt‑2 w‑full text‑sm text‑gray‑500">Cancel</button>
        </div>
    </div>
    );
}