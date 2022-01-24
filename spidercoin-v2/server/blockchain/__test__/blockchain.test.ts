import Blockchain from "../blockchain";
import merkle from "merkle";
import { Transaction } from "../../block/transactions/transactions";

import { testCreateTxs } from "./testCreateTxFunc";

describe("add block from genesis block test", () => {
    const tx1: Transaction[] = testCreateTxs(10);
    let blockchain = new Blockchain();
    blockchain.addBlock(tx1);
    const chain = blockchain.chain;
    const prevBlock = chain[chain.length - 2];
    const newBlock = chain[chain.length - 1];

    test("check newBlock's hash and genesisBlock's hash", () => {
        expect(newBlock.header.prevHash).toBe(prevBlock.hash);
    });
    test("check newBlock's timestamp and genesisBlock's timestamp", () => {
        expect(
            newBlock.header.timestamp > prevBlock.header.timestamp
        ).toBeTruthy();
    });

    test("check newBlock's merkleroot", () => {
        const newMerkleRoot: string = merkle("sha256")
            .sync([JSON.stringify(tx1)])
            .root();
        console.log("in test", newMerkleRoot);
        expect(newBlock.header.merkleRoot).toBe(newMerkleRoot);
    });
});

describe("add block from new created block test", () => {
    const tx1: Transaction[] = testCreateTxs(10);
    const tx2: Transaction[] = testCreateTxs(30);
    let blockchain = new Blockchain();
    blockchain.addBlock(tx1);
    setTimeout(() => {
        blockchain.addBlock(tx2);
    }, 1500);
    const chain = blockchain.chain;
    const prevBlock = chain[chain.length - 2];
    const newBlock = chain[chain.length - 1];

    test("check newBlock's hash and prevBlock's hash", () => {
        expect(newBlock.header.prevHash).toBe(prevBlock.hash);
    });
    test("check newBlock's timestamp and prevBlock's timestamp", () => {
        expect(
            newBlock.header.timestamp > prevBlock.header.timestamp
        ).toBeTruthy();
    });

    test("check newBlock's merkleroot", () => {
        const newMerkleRoot: string = merkle("sha256")
            .sync([JSON.stringify(tx1)])
            .root();
        expect(newBlock.header.merkleRoot).toBe(newMerkleRoot);
    });
});
