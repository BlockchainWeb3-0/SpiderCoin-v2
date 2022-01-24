import CryptoJS from "crypto-js";
import ecdsa from "elliptic";
import { TxOut } from "./txOut/txOut";
import { TxIn } from "./txIn/txIn";
import { UnspentTxOut } from "./unspentTxOut/unspentTxOut";
import { toHexString } from "../../utils/utils";

const ec = new ecdsa.ec("secp256k1");

const COINBASE_AMOUNT: number = 50;

export class Transaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];
}

/**
 *
 * @param transaction transaction
 * @returns transaction's Id
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

/**
 *
 * @param transactionId transaction's Id
 * @param index transactions out's Index
 * @param fUnspentTxOuts unspent transaction outputs
 * @returns 1 unspent transaction
 */
const findUnspentTxOut = (
    transactionId: string,
    index: number,
    fUnspentTxOuts: UnspentTxOut[]
): UnspentTxOut | undefined => {
    return fUnspentTxOuts.find(
        (uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index
    );
};

const signTxIn = (
    transaction: Transaction,
    txInIndex: number,
    privateKey: string,
    unSpentTxOuts: UnspentTxOut[]
): string => {
    try {
        const txIn: TxIn = transaction.txIns[txInIndex];
        const dataToSign: string = transaction.id;
        const referencedUnspentTxOut: UnspentTxOut | undefined =
            findUnspentTxOut(transaction.id, txInIndex, unSpentTxOuts);
        if (referencedUnspentTxOut === undefined) {
            throw new Error("Can't find transaction Id from UnspentTxOut");
        }
        const referencedAddress: string = referencedUnspentTxOut.address;
        const key = ec.keyFromPrivate(privateKey, "hex");
        const signature: string = toHexString(key.sign(dataToSign).toDER());
        return signature;
    } catch (error) {
        console.log(error);
    }
};

export { getTransactionId };
