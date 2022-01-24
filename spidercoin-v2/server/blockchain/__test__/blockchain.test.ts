import merkle from "merkle";
import { Blockchain } from "../blockchain";
import { testCreateTxs } from "./testCreateTxFunc";
import { isValidNewBlock } from "../../utils/utils";
import { Block } from "../block/block";
import { Transaction } from "../block/transactions/transactions";

describe("add block from genesis block test", () => {
    let tx1: Transaction[], chain: Block[], prevBlock: Block, newBlock: Block;
    beforeEach(() => {
        let blockchain: Blockchain = new Blockchain();
        tx1 = testCreateTxs(10);
        blockchain.addBlock(tx1);
        chain = blockchain.chain;
        prevBlock = chain[chain.length - 2];
        newBlock = chain[chain.length - 1];
    });

    test("check newBlock's structure", () => {
        expect(isValidNewBlock(newBlock, prevBlock)).toBeTruthy();
    });

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
        expect(newBlock.header.merkleRoot).toBe(newMerkleRoot);
    });
});

describe("add block from new created block test", () => {
    let tx1: Transaction[],
        tx2: Transaction[],
        chain: Block[],
        prevBlock: Block,
        newBlock: Block;
    beforeEach(() => {
        let blockchain: Blockchain = new Blockchain();
        tx1 = testCreateTxs(10);
        tx2 = testCreateTxs(30);
        blockchain.addBlock(tx1);
        setTimeout(() => {
            blockchain.addBlock(tx2);
        }, 1500);
        chain = blockchain.chain;
        prevBlock = chain[chain.length - 2];
        newBlock = chain[chain.length - 1];
    });

    test("check newBlock's structure", () => {
        expect(isValidNewBlock(newBlock, prevBlock)).toBeTruthy();
    });

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
