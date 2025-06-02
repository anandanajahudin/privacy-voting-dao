import { useState } from "react";
import VoteDialog from "./VoteDialog";

export default function ProposalCard({ p }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border rounded‑2xl shadow p‑4">
        <h2 className="text‑xl font‑semibold">{p.title}</h2>
        <p className="text‑sm text‑gray‑500 mb‑2">ID #{p.id} • {p.open ?
        "Open" : "Closed"}</p>
        <button className="bg‑blue‑600 text‑white px‑3 py‑1 rounded"
        onClick={() => setOpen(true)} disabled={!p.open}>
        Vote
        </button>
        {open && <VoteDialog proposal={p} onClose={() => setOpen(false)} /
        >}
        </div>
    );
}