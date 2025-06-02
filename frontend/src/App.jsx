import { useEffect, useState } from "react";
import ProposalList from "./components/ProposalList";
import { getContract } from "./utils/contract";

export default function App() {
    const [proposals, setProposals] = useState([]);
    useEffect(() => {
        async function load() {
            const dao = getContract();
            const count = await dao.proposalCount();
            const arr = [];
            
            for (let i = 1; i <= count; i++) {
                const { title, pType, open } = await dao.proposals(i);
                arr.push({ id: i, title, pType, open });
            }
            setProposals(arr);
        }
        load();
    }, []);
    return (
    <div className="max‑w‑3xl mx‑auto p‑4">
    <h1 className="text‑3xl font‑bold mb‑4">Privacy Voting DAO</h1>
    <ProposalList proposals={proposals} />
    </div>
    );
}