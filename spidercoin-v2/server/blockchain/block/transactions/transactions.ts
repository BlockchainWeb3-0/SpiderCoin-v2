import CryptoJS from "crypto-js";
import ecdsa from "elliptic";
import { TxOut } from "./txOut/txOut";
import { TxIn } from "./txIn/txIn";
import { UnspentTxOut } from "./unspentTxOut/unspentTxOut";
import { toHexString } from "../../../utils/utils";

const ec = new ecdsa.ec("secp256k1");

const COINBASE_AMOUNT: number = 50;

export class Transaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];
}

export class TxFunctions {
    /**
     * get transaction id from a transaction
     * @param transaction transaction
     * @returns transaction's Id
     */
    static getTransactionId = (transaction: Transaction): string => {
        const txInContent: string = transaction.txIns
            .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
            .reduce((a, b) => a + b, "");
        const txOutContent: string = transaction.txOuts
            .map((TxOut: TxOut) => TxOut.address + TxOut.amount)
            .reduce((a, b) => a + b, "");
        return CryptoJS.SHA256(txInContent + txOutContent).toString();
    };

    /**
     * get public from a privatekey
     * @param privatekey your privatekey
     * @returns a public key from privatekey
     */
    static getPublicKey = (privatekey: string): string => {
        return ec
            .keyFromPrivate(privatekey, "hex")
            .getPublic()
            .encode("hex", false);
    };

    /**
     *
     * @param transactionId transaction's Id
     * @param index transactions out's Index
     * @param fUnspentTxOuts unspent transaction outputs
     * @returns 1 unspent transaction
     */
    static findUnspentTxOut = (
        transactionId: string,
        index: number,
        fUnspentTxOuts: UnspentTxOut[]
    ): UnspentTxOut | undefined => {
        return fUnspentTxOuts.find(
            (uTxO) =>
                uTxO.txOutId === transactionId && uTxO.txOutIndex === index
        );
    };

    static signTxIn = (
        transaction: Transaction,
        txInIndex: number,
        privateKey: string,
        unSpentTxOuts: UnspentTxOut[]
    ): string => {
        try {
            const txIn: TxIn = transaction.txIns[txInIndex];
            const dataToSign: string = transaction.id;
            const referencedUnspentTxOut: UnspentTxOut | undefined =
                this.findUnspentTxOut(transaction.id, txInIndex, unSpentTxOuts);
            if (referencedUnspentTxOut === undefined) {
                throw new Error("Can't find transaction Id from UnspentTxOut");
            }

            const referencedAddress: string = referencedUnspentTxOut.address;
            if (this.getPublicKey(privateKey) !== referencedAddress) {
                throw new Error("Invalid Private Key!");
            }

            const key = ec.keyFromPrivate(privateKey, "hex");
            const signature: string = toHexString(key.sign(dataToSign).toDER());
            return signature;
        } catch (error) {
            console.log(error);
        }
    };

    static updateUnspentTxOuts = (
        transactions: Transaction[],
        unspentTxOuts: UnspentTxOut[]
    ): UnspentTxOut[] => {
        const newUnspentTxOuts: UnspentTxOut[] = transactions
            .map((transaction) => {
                const unSpentTxOuts = transaction.txOuts.map(
                    (txOut, index) =>
                        new UnspentTxOut(
                            transaction.id,
                            index,
                            txOut.address,
                            txOut.amount
                        )
                );
                return unSpentTxOuts;
            })
            .reduce((a, b) => a.concat(b), []);

        const consumedTxOuts: UnspentTxOut[] = transactions
            .map((transaction) => transaction.txIns)
            .reduce((a, b) => a.concat(b), [])
            .map(
                (txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, "", 0)
            );

        const resultingUnspentTxOuts: UnspentTxOut[] = unspentTxOuts
            .filter(
                (uTxO) =>
                    !this.findUnspentTxOut(
                        uTxO.txOutId,
                        uTxO.txOutIndex,
                        consumedTxOuts
                    )
            )
            .concat(newUnspentTxOuts);

        return resultingUnspentTxOuts;
    };
}
