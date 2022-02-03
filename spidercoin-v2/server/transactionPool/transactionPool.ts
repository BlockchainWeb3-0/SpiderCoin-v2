import _ from "lodash";
import { Transaction } from "../blockchain/block/transactions/transactions";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";
import { isValidTxForPool } from "../utils/txPoolValidate";
import { validateTransaction } from "../utils/utilFunction";
import { hasTxIn } from "../utils/utilFunction";
export let transactionPool: Transaction[] = [];

export class TransactionPool {
    public transactionPool: Transaction[] = [];

    static getTransactionPool = () => {
        // const transactionPool = new TransactionPool();
        return _.cloneDeep(transactionPool);
    };

    static addToTransactionPool = (
        tx: Transaction,
        unspentTxOuts: UnspentTxOut[] | null
    ) => {
        if (unspentTxOuts === null) {
            throw new Error("unsepentTxOuts are null");
        }
        // 먼저 transaction 검사
        if (!validateTransaction(tx, unspentTxOuts)) {
            throw new Error("Trying to add invalid tx to pool");
        }
        //
        if (!isValidTxForPool(tx, transactionPool)) {
            throw Error("Trying to add invalid tx to pool");
        }
        console.log("adding to txPool: %s", JSON.stringify(tx));
        transactionPool.push(tx);
    };

    static updateTransactionPool = (unspentTxOuts: UnspentTxOut[]) => {
        const invalidTxs = [];
        for (const tx of transactionPool) {
            for (const txIn of tx.txIns) {
                if (!hasTxIn(txIn, unspentTxOuts)) {
                    invalidTxs.push(tx);
                    break;
                }
            }
        }
        if (invalidTxs.length > 0) {
            console.log(
                "removing the following transactions from txPool : %s",
                JSON.stringify(invalidTxs)
            );
            transactionPool = _.without(transactionPool, ...invalidTxs);
        }
    };
}

//TransactionPool.addToTransactionPool(GENESIS_TRANSACTION, unspentTxOuts);
