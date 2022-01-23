import CryptoJS from "crypto-js";
import merkle from "merkle";
import { BlockHeader } from "./blockheader/blockheader";
import { Transaction } from "./transactions/transactions";
import * as config from "../config";

/**
 * block's genesis transaction
 */
const genesisTransaction: Transaction = {
    txIns: [{ signature: "", txOutId: "", txOutIndex: 0 }],
    txOuts: [
        {
            address:
                "04875a5ee53110a1ce856f2fc549671456afcc62a510d96cb8e05ca0cb65f78c0b1fb880db8ac195cee93d2d6eff917e795f224d63a2c73319b1ce1e42f27395a4",
            amount: 50,
        },
    ],
    id: "ff21efb83712a97c5bab8babbf5e7e6b3af9fce90aae1fcf5dbe45e753e594ba",
};

/**
 * Block class
 */
export class Block {
    public header: BlockHeader;
    public hash: string;
    public transaction: Transaction[];

    constructor(header: BlockHeader, hash: string, transaction: Transaction[]) {
        this.header = header;
        this.hash = hash;
        this.transaction = transaction;
    }

    /**
     *
     * @param blockHeader block's header
     * @returns this block's hash string
     */
    static calHashOfBlock = (blockHeader: BlockHeader): string => {
        try {
            if (typeof blockHeader === "object") {
                const blockString: string =
                    blockHeader.version +
                    blockHeader.index +
                    blockHeader.prevHash +
                    blockHeader.merkleRoot +
                    blockHeader.timestamp +
                    blockHeader.difficulty +
                    blockHeader.nonce;
                const hash = CryptoJS.SHA256(blockString).toString();
                return hash;
            }
            throw new Error("Invalid BlockHeader");
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *
     * @returns get genesis block
     */
    static getGenesisBlock = (): Block => {
        try {
            const transaction: Transaction[] = [genesisTransaction];
            const header = new BlockHeader(
                BlockHeader.getVersion(),
                0,
                "0".repeat(64),
                merkle("sha256")
                    .sync([JSON.stringify(transaction)])
                    .root() || "0".repeat(64),
                1631006505,
                config.INITIAL_DIFFICULTY,
                2083236893
            );
            const hash = this.calHashOfBlock(header);
            if (!hash) {
                throw new Error("Invalid Hash");
            }

            const genesisBlock: Block = new Block(header, hash, transaction);
            return genesisBlock;
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *
     * @param lastBlock  chain's last block
     * @param transaction block's transaction
     * @returns 1 new Block
     */
    static mineNewBlock = (
        lastBlock: Block,
        transaction: Transaction[]
    ): Block => {
        try {
            const version: string = BlockHeader.getVersion();
            const index: number = lastBlock.header.index + 1;
            const prevHash: string = lastBlock.hash;
            let merkleRoot: string;
            if (transaction.length) {
                merkleRoot = merkle("sha256")
                    .sync([JSON.stringify(transaction)])
                    .root();
            } else {
                merkleRoot = "0".repeat(64);
            }
            console.log("mineNewBlock's merkleRoot", merkleRoot);
            let timestamp: number;
            const difficulty: number = BlockHeader.adjustDifficulty(
                lastBlock.header,
                timestamp
            );
            let nonce: number = 0;
            let blockHeader: BlockHeader;
            let hash: string;

            do {
                timestamp = Math.round(Date.now() / 1000);
                blockHeader = new BlockHeader(
                    version,
                    index,
                    prevHash,
                    merkleRoot,
                    timestamp,
                    difficulty,
                    nonce
                );
                hash = this.calHashOfBlock(blockHeader);
                nonce++;
            } while (!hash.startsWith("0".repeat(difficulty)));
            const newBlock: Block = new Block(blockHeader, hash, transaction);
            return newBlock;
        } catch (error) {
            console.log(error);
        }
    };
}
