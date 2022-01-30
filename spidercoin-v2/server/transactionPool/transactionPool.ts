import _ from "lodash";
import {
    Transaction,
    unspentTxOuts,
} from "../blockchain/block/transactions/transactions";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";
import { GENESIS_TRANSACTION } from "../config";
import { isValidTxForPool } from "../utils/txPoolValidate";
import { validateTransaction } from "../utils/txValidate";

export let transactionPool: Transaction[] = [];

class TransactionPool {
    public transactionPool: Transaction[] = [];

    static getTransactionPool = () => {
        // const transactionPool = new TransactionPool();
        return _.cloneDeep(transactionPool);
    };

    static addToTransactionPool = (
        tx: Transaction,
        unspentTxOuts: UnspentTxOut[] | null
    ) => {
        console.log("addto에 들어온 tx : ", tx);
        console.log("addto에 들어온 uTxO : ", unspentTxOuts);

        if (unspentTxOuts === null) {
            throw new Error("aaa");
        }
        if (!validateTransaction(tx, unspentTxOuts)) {
            throw new Error("Trying to add invalid tx to pool");
        }

        if (!isValidTxForPool(tx, transactionPool)) {
            throw Error("Trying to add invalid tx to pool");
        }
        console.log("adding to txPool: %s", JSON.stringify(tx));
        transactionPool.push(tx);
    };
}

TransactionPool.addToTransactionPool(GENESIS_TRANSACTION, unspentTxOuts);
