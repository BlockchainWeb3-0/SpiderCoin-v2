import { Block } from "../block/block";
import merkle from "merkle";

/**
 *
 * @param block block
 * @returns if valid -> true, if not valid -> false
 */
const isValidBlockStructure = (block: Block) => {
    return (
        typeof block.header.version === "string" &&
        typeof block.header.index === "number" &&
        typeof block.header.prevHash === "string" &&
        typeof block.header.merkleRoot === "string" &&
        typeof block.header.timestamp === "number" &&
        typeof block.header.difficulty === "number" &&
        typeof block.header.nonce === "number" &&
        typeof block.transaction === "object" &&
        typeof block.hash === "string"
    );
};

/**
 *
 * @param newBlock new block
 * @param lastBlock chain's last block
 * @returns if valid block -> true, if not valid block -> false
 */
const isValidNewBlock = (newBlock: Block, lastBlock: Block): boolean => {
    /**
     * Validate
     *  1. block structure
     *  2. index
     *  3. prevHash
     *  4. merkleRoot
     *  5. timestamp
     *  6. difficulty
     */
    if (!isValidBlockStructure(newBlock)) {
        console.log("Invalid Block structure");
        return false;
    } else if (newBlock.header.index !== lastBlock.header.index + 1) {
        console.log("Invalid index");
        return false;
    } else if (newBlock.header.prevHash !== lastBlock.hash) {
        console.log("Invalid prevHash");
        return false;
    } else if (
        (newBlock.transaction.length === 0 &&
            newBlock.header.merkleRoot !== "0".repeat(64)) ||
        (newBlock.transaction.length !== 0 &&
            newBlock.header.merkleRoot !==
                merkle("sha256")
                    .sync([JSON.stringify(newBlock.transaction)])
                    .root())
    ) {
        console.log("Invalid merkleRoot");
        return false;
    } else if (newBlock.header.timestamp < lastBlock.header.timestamp) {
        console.log("Invalid timestamp");
        return false;
    } else if (
        !newBlock.hash.startsWith("0".repeat(newBlock.header.difficulty))
    ) {
        console.log("Invalid difficulty");
        return false;
    }
    return true;
};

export { isValidBlockStructure, isValidNewBlock };
