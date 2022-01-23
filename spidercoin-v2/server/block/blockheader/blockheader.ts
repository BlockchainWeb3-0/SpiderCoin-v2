/**
 * blockheader.ts
 */

import fs from "fs";
import * as config from "../../config";

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

    static adjustDifficulty(
        lastBlockHeader: BlockHeader,
        newBlockTime: number
    ): number {
        let difficulty: number = lastBlockHeader.difficulty;
        const newBlockInterval: number =
            newBlockTime - lastBlockHeader.timestamp;
        if (
            lastBlockHeader.index % config.BLOCK_GENERATION_INTERVAL === 0 &&
            lastBlockHeader.index !== 0
        ) {
            if (newBlockInterval > config.MINE_INTERVAL * 2) {
                return difficulty - 1;
            } else if (newBlockInterval < config.MINE_INTERVAL / 2) {
                return difficulty + 1;
            }
        }
        return difficulty;
    }
}
