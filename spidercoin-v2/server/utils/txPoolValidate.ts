import { Transaction } from "../blockchain/block/transactions/transactions";
import { getTxPoolIns } from "./utils";
import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
import _ from "lodash";

const isValidTxForPool = (
    tx: Transaction,
    aTtransactionPool: Transaction[]
): boolean => {
    const txPoolIns: TxIn[] = getTxPoolIns(aTtransactionPool);

    const containsTxIn = (txIns: TxIn[], txIn: TxIn) => {
        return _.find(txPoolIns, (txPoolIn) => {
            return (
                txIn.txOutIndex === txPoolIn.txOutIndex &&
                txIn.txOutId === txPoolIn.txOutId
            );
        });
    };

    for (const txIn of tx.txIns) {
        if (containsTxIn(txPoolIns, txIn)) {
            console.log("txIn already found in the txPool");
            return false;
        }
    }
    return true;
};

export { isValidTxForPool };
