import { config as dotenv } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat‑toolbox";

dotenv();

const config = /** @type {HardhatUserConfig} */ ({
    solidity: "0.8.24",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        sepolia: {
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
});
export default config;