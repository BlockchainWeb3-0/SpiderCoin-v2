import {
    Transaction,
    TxFunctions,
} from "../blockchain/block/transactions/transactions";
import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
import { TxOut } from "../blockchain/block/transactions/txOut/txOut";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";

import * as ecdsa from "elliptic";
import { hasDuplicates, validateCoinbaseTx } from "./utils";
import _ from "lodash";
const ec = new ecdsa.ec("secp256k1");

/**
 * check isNull, type
 * @param txIn trnasaction's Input
 * @returns valid TxIn's structure -> true / not valid TxIn's structure -> false
 */
const isValidTxInStructure = (txIn: TxIn): boolean => {
    if (txIn == null) {
        console.log("txIn is null");
        return false;
    } else if (typeof txIn.signature !== "string") {
        console.log("invalid signature type in txIn");
        return false;
    } else if (typeof txIn.txOutId !== "string") {
        console.log("invalid txOutId type in txIn");
        return false;
    } else if (typeof txIn.txOutIndex !== "number") {
        console.log("invalid txOutIndex type in txIn");
        return false;
    }
    return true;
};

/**
 * check length, regular expression, match
 * @param address address
 * @returns valid address -> true / not valid address -> false
 */
const isValidAddress = (address: string): boolean => {
    if (address.length !== 130) {
        console.log("Invalid public key length");
        return false;
    } else if (address.match("^[a-fA-F0-9]+$") === null) {
        console.log("Public key must contain only hex characters");
        return false;
    } else if (!address.startsWith("04")) {
        console.log("Public key must start with 04");
        return false;
    }
    return true;
};

/**
 * check isNull, type, match
 * @param txOut transaction's output
 * @returns valid TxOut's structure -> true / not valid TxOut's structure -> false
 */
const isValidTxOutStructure = (txOut: TxOut): boolean => {
    if (txOut == null) {
        console.log("txOut is null");
        return false;
    } else if (typeof txOut.address !== "string") {
        console.log("invalid address type in txOut");
        return false;
    } else if (!isValidAddress(txOut.address)) {
        console.log("invalid TxOut address");
        return false;
    } else if (typeof txOut.amount !== "number") {
        console.log("invalid amount type in txOut");
        return false;
    }
    return true;
};

/**
 * check type
 * @param transaction transaction
 * @returns valid transaction's structure -> true / not valid transaction's structure -> false
 */
const isValidTransactionStructure = (transaction: Transaction) => {
    try {
        if (typeof transaction.id !== "string") {
            console.log("Invalid Transaction Id. This is not a string!!!");
            return false;
        }
        if (!(transaction.txIns instanceof Array)) {
            console.log("Invalid txIns type in transaction");
            return false;
        }
        if (
            !transaction.txIns
                .map(isValidTxInStructure)
                .reduce((a, b) => a && b, true)
        ) {
            return false;
        }

        if (!(transaction.txOuts instanceof Array)) {
            console.log("invalid txIns type in transaction");
            return false;
        }

        if (
            !transaction.txOuts
                .map(isValidTxOutStructure)
                .reduce((a, b) => a && b, true)
        ) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
    }
};

/**
 * check match, verify key, signature
 * @param txIn transactions's input
 * @param transaction transaction
 * @param unspentTxOuts unspent transactions
 * @returns valid TxIn -> true / not valid TxIn -> false
 */
const validateTxIn = (
    txIn: TxIn,
    transaction: Transaction,
    unspentTxOuts: UnspentTxOut[]
): boolean => {
    try {
        // 파라미터로 받은 txIn을 UTxO 중에서 찾는다.
        const referencedUTxOut: UnspentTxOut | undefined = unspentTxOuts.find(
            (uTxO) =>
                uTxO.txOutId === txIn.txOutId &&
                uTxO.txOutIndex === txIn.txOutIndex
        );
        // 찾은 UTxO값이 null이면 찾이 못했음.
        if (referencedUTxOut == undefined) {
            return false;
            // throw new Error("Referenced txOut not found");
        }
        // 찾은 UTxO의 address의 key를 확인하고
        const address: string = referencedUTxOut.address;
        const key = ec.keyFromPublic(address, "hex");
        // signature가 맞는지 확인한다.
        const validSignature: boolean = key.verify(
            transaction.id,
            txIn.signature
        );
        if (!validSignature) {
            console.log("Invalid TxIn signature");
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/**
 * check structure, txId, amount
 * @param transaction transaction
 * @param unspentTxOuts unspent transaction outs
 * @returns valid transaction -> true / not valid transaction -> false
 */
const validateTransaction = (
    transaction: Transaction,
    unspentTxOuts: UnspentTxOut[]
): boolean => {
    // structure 체크
    if (!isValidTransactionStructure) {
        return false;
    }
    // 받은 Tx의 id가 계산한 Tx의 id와 다를 시
    if (TxFunctions.getTransactionId(transaction) !== transaction.id) {
        console.log("Invalid txId");
        return false;
    }
    console.log("/////////////////////////////////////////");
    console.log(TxFunctions.getTransactionId(transaction));
    console.log(transaction);
    console.log("/////////////////////////////////////////");
    // 받은 Tx의 TxIn들을 하나하나 확인해서 유효한 TxIn들인지 확인
    const hasValidTxIns: boolean = transaction.txIns
        .map((txIn) => validateTxIn(txIn, transaction, unspentTxOuts))
        .reduce((a, b) => a && b, true);
    if (!hasValidTxIns) {
        console.log("Some of the txIns are invalid in tx");
        return false;
    }

    // 받은 Tx의 TxIn들을 하나하나 확인한 total amount 값
    const totalTxInValues: number = transaction.txIns
        .map((txIn) => TxFunctions.getTxInAmount(txIn, unspentTxOuts))
        .reduce((a, b) => a + b, 0);
    // 받은 Tx의 TxOut들을 하나하나 확인한 total amout 값
    const totalTxOutValues: number = transaction.txOuts
        .map((txOut) => txOut.amount)
        .reduce((a, b) => a + b, 0);
    // 두개가 다를 시
    if (totalTxInValues !== totalTxOutValues) {
        console.log("totalTxOutValues !== totalTxInValues in tx");
        return false;
    }
    return true;
};

/**
 *
 * @param transactions
 * @param unspentTxOuts
 * @param blockIndex
 * @returns
 */
const validateBlockTransactions = (
    transactions: Transaction[],
    unspentTxOuts: UnspentTxOut[],
    blockIndex: number
): boolean => {
    // 코인베이스 트랜잭션이 유효한가
    const coinbaseTx = transactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log("Invalid coinbase transaction");
        return false;
    }

    // Tx[]에서 txIns들만 뽑아오기
    const txIns: TxIn[] = _(transactions)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
    // TxIns들 중에 중복이 있느냐! (이중 지불 방지)
    if (hasDuplicates(txIns)) {
        return false;
    }

    // coinbase Tx를 뺀 나머지 Tx들
    const normalTransactions: Transaction[] = transactions.slice(1);
    return normalTransactions
        .map((tx) => validateTransaction(tx, unspentTxOuts))
        .reduce((a, b) => a && b, true);
};

export { validateTransaction, validateBlockTransactions };
