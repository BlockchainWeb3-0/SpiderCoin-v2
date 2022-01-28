import CryptoJS from "crypto-js";
import ecdsa from "elliptic";
import { TxOut } from "./txOut/txOut";
import { TxIn } from "./txIn/txIn";
import { UnspentTxOut } from "./unspentTxOut/unspentTxOut";
import { toHexString, validateBlockTransactions } from "../../../utils/utils";
import { Block } from "../block";

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
    ): UnspentTxOut => {
        const findUTxO = fUnspentTxOuts.find(
            (uTxO) =>
                uTxO.txOutId === transactionId && uTxO.txOutIndex === index
        );
        if (findUTxO == undefined) {
            throw new Error("can't find UTxO");
        }
        return findUTxO;
    };

    /**
     *
     * @param transaction transaction
     * @param txInIndex transaction input's index
     * @param privateKey private key
     * @param unSpentTxOuts unspent transaction outputs
     * @returns TxIn's signature
     */
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
                this.findUnspentTxOut(
                    txIn.txOutId,
                    txIn.txOutIndex,
                    unSpentTxOuts
                );
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
            throw error;
        }
    };

    /**
     *
     * @param transactions transaction [ ]
     * @param unspentTxOuts unspent transaction output [ ]
     * @returns updated unspent transaction output [ ]
     */
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

    /**
     *
     * @param txIn transaction input
     * @param unspentTxOuts unspent transaction output [ ]
     * @returns
     */
    static getTxInAmount = (
        txIn: TxIn,
        unspentTxOuts: UnspentTxOut[]
    ): number => {
        const txInAmount: number = this.findUnspentTxOut(
            txIn.txOutId,
            txIn.txOutIndex,
            unspentTxOuts
        ).amount;
        return txInAmount;
    };

    static processTransactions = (
        transactions: Transaction[],
        unspentTxOuts: UnspentTxOut[],
        blockIndex: number
    ): UnspentTxOut[] | null => {
        if (
            !validateBlockTransactions(transactions, unspentTxOuts, blockIndex)
        ) {
            console.log("Invalid block Transactions");
            return null;
        }
        return this.updateUnspentTxOuts(transactions, unspentTxOuts);
    };

    /**
     *
     * @param address Address to receive reward for mining
     * @param blockIndex block's index
     * @returns a coinbase transaction
     */
    // static getCoinbaseTransaction = (
    //     address: string,
    //     blockIndex: number
    // ): Transaction => {
    //     const coinbaseTransaction = new Transaction();
    //     let txIn: TxIn;
    //     txIn.signature = "";
    //     txIn.txOutId = "";
    //     txIn.txOutIndex = blockIndex;

    //     coinbaseTransaction.txIns = [txIn];
    //     coinbaseTransaction.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    //     coinbaseTransaction.id = this.getTransactionId(coinbaseTransaction);
    //     return coinbaseTransaction;
    // };
}

export let unspentTxOuts = TxFunctions.processTransactions(
    Block.getGenesisBlock().transaction,
    [],
    0
);

console.log("이건 제네시스 utxo", unspentTxOuts);
