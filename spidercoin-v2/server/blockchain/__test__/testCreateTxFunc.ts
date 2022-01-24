import { ec } from "elliptic";
import fs from "fs";
import { getPrivateFromWallet } from "../../wallet/wallet";
import { TxIn } from "../../block/transactions/txIn/txIn";
import { TxOut } from "../../block/transactions/txOut/txOut";
import {
    Transaction,
    TxFunctions,
} from "../../block/transactions/transactions";

const testGetPublicFromWallet = (filename: string) => {
    const buffer = fs.readFileSync(`node/wallet/${filename}`, "utf8");
    const privateKey: string = buffer.toString();
    const key = EC.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex", false);
};

const EC = new ec("secp256k1");
export const testCreateTxs = (amount: number): Transaction[] => {
    const testMyAddress: string = testGetPublicFromWallet("private_key");
    const testMyPrivateKey: string = getPrivateFromWallet();
    const testTxOutAddress: string = testGetPublicFromWallet("private_key2");
    const testTxIn: TxIn = {
        txOutId: testMyAddress,
        txOutIndex: 0,
        signature: "",
    };
    const testTxOut: TxOut = {
        address: testTxOutAddress,
        amount,
    };
    const tx: Transaction = new Transaction();
    tx.txIns = [testTxIn];
    tx.txOuts = [testTxOut];
    tx.id = TxFunctions.getTransactionId(tx);

    const txData: Transaction[] = [tx];

    return txData;
};
