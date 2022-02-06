import { TransactionPool } from "../../transactionPool/transactionPool";
import { isValidNewBlock } from "../../utils/blockValidate";
import { createTransaction } from "../../wallet/wallet";
import { Block } from "../block/block";
import { Transaction, TxFunctions } from "../block/transactions/transactions";
import { UnspentTxOut } from "../block/transactions/unspentTxOut/unspentTxOut";

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
    sendTransaction = (
        address: string,
        amount: number,
        privateKey: string,
        unspentTxOuts: UnspentTxOut[],
        transactionPool: Transaction[],
        myAddress: string
    ): Transaction => {
        const tx: Transaction = createTransaction(
            address,
            amount,
            privateKey,
            unspentTxOuts,
            transactionPool,
            myAddress
        );
        TransactionPool.addToTransactionPool(tx, unspentTxOuts);
        return tx;
    };

    getBlockData = (
        txOutAddress: string,
        blockchain: Blockchain,
        transactionPool: Transaction[]
    ) => {
        const coinbaseTx: Transaction = TxFunctions.getCoinbaseTransaction(
            txOutAddress,
            blockchain.getLastBlock().header.index + 1
        );
        const transactions: Transaction[] = transactionPool;
        const blockData: Transaction[] = [coinbaseTx].concat(transactions);
        return blockData;
    };
}
