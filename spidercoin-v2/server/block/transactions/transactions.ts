import CryptoJS from "crypto-js";
import ecdsa from "elliptic";

const ec = new ecdsa.ec("secp256k1");

const COINBASE_AMOUNT: number = 50;

export class Transaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];
}

/**
 *
 * @param transaction
 */
const getTransactionId = (transaction: Transaction): string => {
    const txInContent: string = transaction.txIns
        .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, "");
    const txOutContent: string = transaction.txOuts
        .map((TxOut: TxOut) => TxOut.address + TxOut.amount)
        .reduce((a, b) => a + b, "");
    return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

export { getTransactionId };
