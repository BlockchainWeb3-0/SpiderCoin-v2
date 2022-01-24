import merkle from "merkle";
import { Block } from "../blockchain/block/block";

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

/**
 * 한자리 수도 두자리로 나타내기 위해 "0"을 더함.
 * 두자리 수는 0을 더해서 세자리가 되므로 slice로 마지막 두 숫자만 반환
 * @param byteArray
 * @returns Hex data -> String data
 */
const toHexString = (byteArray: number[]): string => {
    return Array.from(byteArray, (byte: any) =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
};

export { isValidBlockStructure, isValidNewBlock, toHexString };
