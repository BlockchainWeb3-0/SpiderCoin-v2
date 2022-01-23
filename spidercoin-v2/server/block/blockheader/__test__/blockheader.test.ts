import { BlockHeader } from "../blockheader";
import merkle from "merkle";
import { Transaction } from "../../transactions/transactions";
import * as config from "../../../config";

describe("BlockHeader test", () => {
    let genesisTransaction: Transaction,
        genesisBlockHeader: BlockHeader,
        newBlockHeader: BlockHeader;
    beforeEach(() => {
        genesisTransaction = {
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

        genesisBlockHeader = new BlockHeader(
            BlockHeader.getVersion(),
            0,
            "0".repeat(64),
            merkle("sha256")
                .sync([JSON.stringify(genesisTransaction)])
                .root() || "0".repeat(64),
            1631006505,
            config.INITIAL_DIFFICULTY,
            2083236893
        );
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

    test("new Block header's validation", () => {});
});
