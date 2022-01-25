import { isValidNewBlock } from "../../utils/utils";
import { Block } from "../block/block";
import { Transaction } from "../block/transactions/transactions";

export class Blockchain {
    public chain: Block[];

    constructor() {
        this.chain = [Block.getGenesisBlock()];
    }

    /**
     *
     * @returns chain's last block
     */
    getLastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
     *
     * @param transaction  transaction
     * @returns 1 new Block
     */
    addBlock(transaction: Transaction[]) {
        const newBlock: Block = Block.mineNewBlock(
            this.chain[this.chain.length - 1],
            transaction
        );
        const lastBlock: Block = this.getLastBlock();
        try {
            if (isValidNewBlock(newBlock, lastBlock)) this.chain.push(newBlock);
            else throw new Error("Invalid Block! You can't add block");
        } catch (error) {
            console.log(error);
        }
        return newBlock;
    }
}
