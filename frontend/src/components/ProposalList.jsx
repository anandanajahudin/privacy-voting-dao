import ProposalCard from "./ProposalCard";

export default function ProposalList({ proposals }) {
return (
    <div className="grid gap‑4">
        {proposals.map(p => (
            <ProposalCard key={p.id} p={p} />
        ))}
    </div>
    );
}