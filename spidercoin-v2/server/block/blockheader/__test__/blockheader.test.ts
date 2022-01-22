import { getVersion } from "jest";
import { BlockHeader } from "../blockheader";

describe("BlockHeader test", () => {
    const newBlockHeader: BlockHeader = new BlockHeader(
        getVersion(),
        1,
        "0".repeat(64),
        "0".repeat(64),
        Date.now(),
        1,
        1
    );
    test("Blockheader structure validation", () => {
        expect(typeof newBlockHeader.version).toBe("string");
        expect(typeof newBlockHeader.index).toBe("number");
        expect(typeof newBlockHeader.prevHash).toBe("string");
        expect(typeof newBlockHeader.merkleRoot).toBe("string");
        expect(typeof newBlockHeader.timestamp).toBe("number");
        expect(typeof newBlockHeader.difficulty).toBe("number");
        expect(typeof newBlockHeader.nonce).toBe("number");
    });

    test("newBlock's version validation", () => {
        expect(typeof newBlockHeader.version).toBe("string");
        expect(typeof newBlockHeader.index).toBe("number");
        expect(typeof newBlockHeader.prevHash).toBe("string");
        expect(typeof newBlockHeader.merkleRoot).toBe("string");
        expect(typeof newBlockHeader.timestamp).toBe("number");
        expect(typeof newBlockHeader.difficulty).toBe("number");
        expect(typeof newBlockHeader.nonce).toBe("number");
    });
});
