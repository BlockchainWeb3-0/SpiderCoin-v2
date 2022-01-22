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
class Block {
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
     * @param blockHeader - block's header
     * @returns this block's hash string
     */
    static calHashOfBlock = (blockHeader: BlockHeader): string => {
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
    };

    /**
     *
     * @returns get genesis block
     */
    static getGenesisBlock = (): Block => {
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
    };
}
