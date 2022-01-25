import { Transaction, TxFunctions } from "../transactions";
import { UnspentTxOut } from "../unspentTxOut/unspentTxOut";
import * as config from "../../../../config";

// TxFunctions.getTransactionId

let unspentTxOuts: UnspentTxOut[] = [];
const genesisTransaction: Transaction[] = [config.GENESIS_TRANSACTION];
TxFunctions.updateUnspentTxOuts(genesisTransaction, unspentTxOuts);

describe("transaction test", () => {
    test("get Transaction's Id", () => {
        console.log(unspentTxOuts);
        console.log(genesisTransaction);
        console.log(unspentTxOuts);
    });
});
