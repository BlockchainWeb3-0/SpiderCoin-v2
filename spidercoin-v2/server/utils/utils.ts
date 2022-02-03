import { Transaction } from "../blockchain/block/transactions/transactions";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";
import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
import { TxFunctions } from "../blockchain/block/transactions/transactions";
import * as config from "../config";
import _ from "lodash";

export const adding = (a: number, b: number): number => {
    return a + b;
};

/**
 * 한자리 수도 두자리로 나타내기 위해 "0"을 더함.
 * 두자리 수는 0을 더해서 세자리가 되므로 slice로 마지막 두 숫자만 반환
 * @param byteArray
 * @returns Hex data -> String data
 */
export const toHexString = (byteArray: number[]): string => {
    return Array.from(byteArray, (byte: any) =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
};

/**
 * check match, value,
 * @param transaction transaction
 * @param blockIndex block's index
 * @returns valid coinbase transaction -> true / not valid coinbase transaction -> false
 */
export const isValidateCoinbaseTx = (
    aTransaction: Transaction,
    blockIndex: number
): boolean => {
    console.log(1);
    // 받은 Tx(coinbaseTx)가 null 일 시
    if (aTransaction == null) {
        console.log(
            "The first transaction in the block must be coinbase transaction"
        );
        return false;
    }
    // 받은 Tx(coinbaseTx)의 id를 계산한 값과 받은 Tx의 현재 id가 같은지
    if (TxFunctions.getTransactionId(aTransaction) !== aTransaction.id) {
        console.log("Invalid coinbase tx Id");
        return false;
    }
    // 받은 Tx(coinbaseTx)의 TxIn의 갯수가 1개가 아닐 시 (coinbase의 TxIn은 1개 밖에 없다.)
    if (aTransaction.txIns.length !== 1) {
        console.log(
            "Only one txIn must be specified in the coinbase transaction"
        );
        return false;
    }
    // 받은 Tx(coinbaseTx)의 TxIn index가 받은 blockIndex가 아닐 시
    if (aTransaction.txIns[0].txOutIndex !== blockIndex) {
        console.log(
            "The txIn signature in coinbase tx must be the block height"
        );
        return false;
    }
    // 받은 Tx(coinbaseTx)의 TxOut의 갯수가 1개가 아닐 시 (coinbase의 TxOut은 1개 밖에 없다.)
    if (aTransaction.txOuts.length !== 1) {
        console.log("Invalid number of txOuts in coinbase transaction");
        return false;
    }
    // 받은 Tx(coinbaseTx)의 TxOut의 amount가 config에 설정된 값이 아닐 시
    if (aTransaction.txOuts[0].amount !== config.COINBASE_AMOUNT) {
        console.log("Invalid coinbase amount in coinbase transaction");
        return false;
    }
    return true;
};

/**
 *
 * @param txIns transaction inputs
 * @returns value > 1 -> it's duplicate!!!!!! -> true
 */
export const hasDuplicates = (txIns: TxIn[]): boolean => {
    /**
     * ex ) { '1':[txOutId+txOutIndex], ... }
     * @returns - { value : key }
     */
    const groups = _.countBy(
        txIns,
        (txIn: TxIn) => txIn.txOutId + txIn.txOutIndex
    );
    return _(groups)
        .map((value, key) => {
            if (value > 1) {
                console.log("duplicate txIn");
                return true;
            } else {
                return false;
            }
        })
        .includes(true);
};

///////////////////////////////////////////////////////////////////////////
// ! Transaction Pools 검사

export const getTxPoolIns = (aTransactionPool: Transaction[]): TxIn[] => {
    return _(aTransactionPool)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
};

export const hasTxIn = (txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean => {
    const foundTxIn = unspentTxOuts.find((uTxO: UnspentTxOut) => {
        return (
            uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
        );
    });
    return foundTxIn !== undefined;
};
