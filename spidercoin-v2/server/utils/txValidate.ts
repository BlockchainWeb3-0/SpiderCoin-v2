// import {
//     Transaction,
//     TxFunctions,
// } from "../blockchain/block/transactions/transactions";
// import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
// import { TxOut } from "../blockchain/block/transactions/txOut/txOut";
// import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";

// import * as ecdsa from "elliptic";
// import { hasDuplicates, isValidateCoinbaseTx } from "./utils/utilFunction";
// import _ from "lodash";
// const ec = new ecdsa.ec("secp256k1");

// /**
//  * check isNull, type
//  * @param txIn trnasaction's Input
//  * @returns valid TxIn's structure -> true / not valid TxIn's structure -> false
//  */
// const isValidTxInStructure = (txIn: TxIn): boolean => {
//     if (txIn == null) {
//         console.log("txIn is null");
//         return false;
//     } else if (typeof txIn.signature !== "string") {
//         console.log("invalid signature type in txIn");
//         return false;
//     } else if (typeof txIn.txOutId !== "string") {
//         console.log("invalid txOutId type in txIn");
//         return false;
//     } else if (typeof txIn.txOutIndex !== "number") {
//         console.log("invalid txOutIndex type in txIn");
//         return false;
//     }
//     return true;
// };

// /**
//  * check length, regular expression, match
//  * @param address address
//  * @returns valid address -> true / not valid address -> false
//  */
// const isValidAddress = (address: string): boolean => {
//     if (address.length !== 130) {
//         console.log("Invalid public key length");
//         return false;
//     } else if (address.match("^[a-fA-F0-9]+$") === null) {
//         console.log("Public key must contain only hex characters");
//         return false;
//     } else if (!address.startsWith("04")) {
//         console.log("Public key must start with 04");
//         return false;
//     }
//     return true;
// };

// /**
//  * check isNull, type, match
//  * @param txOut transaction's output
//  * @returns valid TxOut's structure -> true / not valid TxOut's structure -> false
//  */
// const isValidTxOutStructure = (txOut: TxOut): boolean => {
//     if (txOut == null) {
//         console.log("txOut is null");
//         return false;
//     } else if (typeof txOut.address !== "string") {
//         console.log("invalid address type in txOut");
//         return false;
//     } else if (!isValidAddress(txOut.address)) {
//         console.log("invalid TxOut address");
//         return false;
//     } else if (typeof txOut.amount !== "number") {
//         console.log("invalid amount type in txOut");
//         return false;
//     }
//     return true;
// };

// /**
//  * check type
//  * @param transaction transaction
//  * @returns valid transaction's structure -> true / not valid transaction's structure -> false
//  */
// const isValidTransactionStructure = (transaction: Transaction): boolean => {
//     try {
//         if (typeof transaction.id !== "string") {
//             console.log("Invalid Transaction Id. This is not a string!!!");
//             return false;
//         }
//         if (!(transaction.txIns instanceof Array)) {
//             console.log("Invalid txIns type in transaction");
//             return false;
//         }
//         if (
//             !transaction.txIns
//                 .map(isValidTxInStructure)
//                 .reduce((a, b) => a && b, true)
//         ) {
//             return false;
//         }

//         if (!(transaction.txOuts instanceof Array)) {
//             console.log("invalid txIns type in transaction");
//             return false;
//         }

//         if (
//             !transaction.txOuts
//                 .map(isValidTxOutStructure)
//                 .reduce((a, b) => a && b, true)
//         ) {
//             return false;
//         }
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };

// /**
//  * check match, verify key, signature
//  * @param txIn transactions's input
//  * @param transaction transaction
//  * @param unspentTxOuts unspent transactions
//  * @returns valid TxIn -> true / not valid TxIn -> false
//  */
// const validateTxIn = (
//     txIn: TxIn,
//     transaction: Transaction,
//     unspentTxOuts: UnspentTxOut[]
// ): boolean => {
//     try {
//         // ??????????????? ?????? txIn??? UTxO ????????? ?????????.
//         const referencedUTxOut: UnspentTxOut | undefined = unspentTxOuts.find(
//             (uTxO) =>
//                 uTxO.txOutId === txIn.txOutId &&
//                 uTxO.txOutIndex === txIn.txOutIndex
//         );
//         // ?????? UTxO?????? null?????? ?????? ?????????.
//         if (referencedUTxOut == undefined) {
//             return false;
//             // throw new Error("Referenced txOut not found");
//         }
//         // ?????? UTxO??? address??? key??? ????????????
//         const address: string = referencedUTxOut.address;
//         const key = ec.keyFromPublic(address, "hex");
//         // signature??? ????????? ????????????.
//         const validSignature: boolean = key.verify(
//             transaction.id,
//             txIn.signature
//         );
//         if (!validSignature) {
//             console.log("Invalid TxIn signature");
//             return false;
//         }
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };

// /**
//  * check structure, txId, amount
//  * @param transaction transaction
//  * @param unspentTxOuts unspent transaction outs
//  * @returns valid transaction -> true / not valid transaction -> false
//  */
// const validateTransaction = (
//     transaction: Transaction,
//     unspentTxOuts: UnspentTxOut[]
// ): boolean => {
//     // structure ??????
//     if (!isValidTransactionStructure) {
//         return false;
//     }
//     // ?????? Tx??? id??? ????????? Tx??? id??? ?????? ???
//     if (TxFunctions.getTransactionId(transaction) !== transaction.id) {
//         console.log("Invalid txId");
//         return false;
//     }
//     console.log("/////////////////////////////////////////");
//     console.log(TxFunctions.getTransactionId(transaction));
//     console.log(transaction);
//     console.log("/////////////////////////////////////////");
//     // ?????? Tx??? TxIn?????? ???????????? ???????????? ????????? TxIn????????? ??????
//     const hasValidTxIns: boolean = transaction.txIns
//         .map((txIn) => validateTxIn(txIn, transaction, unspentTxOuts))
//         .reduce((a, b) => a && b, true);
//     if (!hasValidTxIns) {
//         console.log("Some of the txIns are invalid in tx");
//         return false;
//     }

//     // ?????? Tx??? TxIn?????? ???????????? ????????? total amount ???
//     const totalTxInValues: number = transaction.txIns
//         .map((txIn) => TxFunctions.getTxInAmount(txIn, unspentTxOuts))
//         .reduce((a, b) => a + b, 0);
//     // ?????? Tx??? TxOut?????? ???????????? ????????? total amout ???
//     const totalTxOutValues: number = transaction.txOuts
//         .map((txOut) => txOut.amount)
//         .reduce((a, b) => a + b, 0);
//     // ????????? ?????? ???
//     if (totalTxInValues !== totalTxOutValues) {
//         console.log("totalTxOutValues !== totalTxInValues in tx");
//         return false;
//     }
//     return true;
// };

// /**
//  *
//  * @param transactions
//  * @param unspentTxOuts
//  * @param blockIndex
//  * @returns
//  */

// const validateBlockTransactions = (
//     aTransactions: Transaction[],
//     aUnspentTxOuts: UnspentTxOut[],
//     blockIndex: number
// ): boolean => {
//     // ??????????????? ??????????????? ????????????
//     const coinbaseTx: Transaction = aTransactions[0];
//     console.log("coinbase Tx", coinbaseTx);
//     console.log("blockIndex", blockIndex);
//     isValidateCoinbaseTx(coinbaseTx, blockIndex);
//     // console.log(
//     //     "?????? ????????? ??????????",
//     //     utils.isValidateCoinbaseTx(coinbaseTx, blockIndex)
//     // );

//     // if (!utils.isValidateCoinbaseTx(coinbaseTx, blockIndex)) {
//     //     console.log("Invalid coinbase transaction");
//     //     return false;
//     // }

//     // Tx[]?????? txIns?????? ????????????
//     const txIns: TxIn[] = _(aTransactions)
//         .map((tx) => tx.txIns)
//         .flatten()
//         .value();
//     // TxIns??? ?????? ????????? ?????????! (?????? ?????? ??????)
//     if (hasDuplicates(txIns)) {
//         return false;
//     }

//     // coinbase Tx??? ??? ????????? Tx???
//     const normalTransactions: Transaction[] = aTransactions.slice(1);
//     return normalTransactions
//         .map((tx) => validateTransaction(tx, aUnspentTxOuts))
//         .reduce((a, b) => a && b, true);
// };

// export { validateTransaction, validateBlockTransactions };
