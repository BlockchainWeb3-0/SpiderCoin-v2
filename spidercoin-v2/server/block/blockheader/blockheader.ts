/**
 * blockheader.ts
 */

import fs from "fs";
import merkle from "merkle";

/**
 * Block's header
 */
export class BlockHeader {
    public version: string;
    public index: number;
    public prevHash: string;
    public merkleRoot: string;
    public timestamp: number;
    public difficulty: number;
    public nonce: number;

    constructor(
        version: string,
        index: number,
        prevHash: string,
        merkleRoot: string,
        timestamp: number,
        difficulty: number,
        nonce: number
    ) {
        this.version = version;
        this.index = index;
        this.prevHash = prevHash;
        this.merkleRoot = merkleRoot;
        this.timestamp = timestamp;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    /**
     *
     * @returns this blocks's version
     */
    static getVersion = (): string => {
        const packagejson: string = fs.readFileSync("package.json", "utf8");
        const version: string = JSON.parse(packagejson).version;
        return version;
    };
}
const newBlockHeader: BlockHeader = new BlockHeader(
    BlockHeader.getVersion(),
    1,
    "0".repeat(64),
    "0".repeat(64),
    Date.now(),
    1,
    1
);
