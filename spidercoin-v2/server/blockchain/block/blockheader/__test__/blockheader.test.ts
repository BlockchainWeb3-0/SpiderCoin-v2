import { BlockHeader } from "../blockheader";
import merkle from "merkle";
import * as config from "../../../../config";
import { genesisBlock } from "./testGenesisBlock";

describe("BlockHeader test", () => {
    const genesisTransaction = config.GENESIS_TRANSACTION;
    let genesisBlockHeader: BlockHeader;
    beforeEach(() => {
        genesisBlockHeader = genesisBlock;
    });

    test("Genesis blockheader structure validation", () => {
        expect(typeof genesisBlockHeader.version).toBe("string");
        expect(typeof genesisBlockHeader.index).toBe("number");
        expect(typeof genesisBlockHeader.prevHash).toBe("string");
        expect(typeof genesisBlockHeader.merkleRoot).toBe("string");
        expect(typeof genesisBlockHeader.timestamp).toBe("number");
        expect(typeof genesisBlockHeader.difficulty).toBe("number");
        expect(typeof genesisBlockHeader.nonce).toBe("number");
    });

    test("genesis header's version validation", () => {
        const version: string = genesisBlockHeader.version;
        const expectedVersion: string = BlockHeader.getVersion();
        expect(version).toBe(expectedVersion);
    });
    test("genesis header's index validation", () => {
        const index: number = genesisBlockHeader.index;
        const expectedIndex: number = 0;
        expect(index).toBe(expectedIndex);
    });
    test("genesis header's merkleRoot validation", () => {
        const merkleRoot: string = genesisBlockHeader.merkleRoot;
        const expectedMerkleRoot: string = merkle("sha256")
            .sync([JSON.stringify(genesisTransaction)])
            .root();
        expect(merkleRoot).toBe(expectedMerkleRoot);
    });
    test("genesis header's timestamp validation", () => {
        const timestamp: number = genesisBlockHeader.timestamp;
        const expectedTimestamp: number = 1631006505;
        expect(timestamp).toBe(expectedTimestamp);
    });
    test("genesis header's difficulty validation", () => {
        const difficulty: number = genesisBlockHeader.difficulty;
        const expectedDifficulty: number = config.INITIAL_DIFFICULTY;
        expect(difficulty).toBe(expectedDifficulty);
    });
});
