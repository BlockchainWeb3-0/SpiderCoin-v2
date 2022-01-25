import merkle from "merkle";
import { Block } from "../blockchain/block/block";
import {
    Transaction,
    TxFunctions,
} from "../blockchain/block/transactions/transactions";
import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
import { TxOut } from "../blockchain/block/transactions/txOut/txOut";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";
import * as ecdsa from "elliptic";

const ec = new ecdsa.ec("secp256k1");

/**
 *
 * @param block block
 * @returns if valid -> true, if not valid -> false
 */
const isValidBlockStructure = (block: Block) => {
    return (
        typeof block.header.version === "string" &&
        typeof block.header.index === "number" &&
        typeof block.header.prevHash === "string" &&
        typeof block.header.merkleRoot === "string" &&
        typeof block.header.timestamp === "number" &&
        typeof block.header.difficulty === "number" &&
        typeof block.header.nonce === "number" &&
        typeof block.transaction === "object" &&
        typeof block.hash === "string"
    );
};

/**
 *
 * @param newBlock new block
 * @param lastBlock chain's last block
 * @returns if valid block -> true, if not valid block -> false
 */
const isValidNewBlock = (newBlock: Block, lastBlock: Block): boolean => {
    /**
     * Validate
     *  1. block structure
     *  2. index
     *  3. prevHash
     *  4. merkleRoot
     *  5. timestamp
     *  6. difficulty
     */
    if (!isValidBlockStructure(newBlock)) {
        console.log("Invalid Block structure");
        return false;
    } else if (newBlock.header.index !== lastBlock.header.index + 1) {
        console.log("Invalid index");
        return false;
    } else if (newBlock.header.prevHash !== lastBlock.hash) {
        console.log("Invalid prevHash");
        return false;
    } else if (
        (newBlock.transaction.length === 0 &&
            newBlock.header.merkleRoot !== "0".repeat(64)) ||
        (newBlock.transaction.length !== 0 &&
            newBlock.header.merkleRoot !==
                merkle("sha256")
                    .sync([JSON.stringify(newBlock.transaction)])
                    .root())
    ) {
        console.log("Invalid merkleRoot");
        return false;
    } else if (newBlock.header.timestamp < lastBlock.header.timestamp) {
        console.log("Invalid timestamp");
        return false;
    } else if (
        !newBlock.hash.startsWith("0".repeat(newBlock.header.difficulty))
    ) {
        console.log("Invalid difficulty");
        return false;
    }
    return true;
};

/**
 * 한자리 수도 두자리로 나타내기 위해 "0"을 더함.
 * 두자리 수는 0을 더해서 세자리가 되므로 slice로 마지막 두 숫자만 반환
 * @param byteArray
 * @returns Hex data -> String data
 */
const toHexString = (byteArray: number[]): string => {
    return Array.from(byteArray, (byte: any) =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
};

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

const validateTxIn = (
    txIn: TxIn,
    transaction: Transaction,
    unspentTxOuts: UnspentTxOut[]
): boolean => {
    const referencedUTxOut: UnspentTxOut = unspentTxOuts.find(
        (uTxO) =>
            uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
    );
    if (referencedUTxOut == null) {
        console.log("Referenced txOut not found");
        return false;
    }
    const address: string = referencedUTxOut.address;
    const key = ec.keyFromPublic(address, "hex");
    const validSignature: boolean = key.verify(transaction.id, txIn.signature);
    if (!validSignature) {
        console.log("Invalid TxIn signature");
        return false;
    }
    return true;
};

const validtateTransaction = (
    transaction: Transaction,
    unspentTxOuts: UnspentTxOut[]
): boolean => {
    if (!isValidTransactionStructure) {
        return false;
    }
    if (TxFunctions.getTransactionId(transaction) !== transaction.id) {
        console.log("Invalid txId");
        return false;
    }
    const hasValidTxIns: boolean = transaction.txIns
        .map((txIn) => validateTxIn(txIn, transaction, unspentTxOuts))
        .reduce((a, b) => a && b, true);

    return true;
};

export {
    isValidBlockStructure,
    isValidNewBlock,
    toHexString,
    isValidTransactionStructure,
};
