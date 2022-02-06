import { ec } from "elliptic";
import fs from "fs";
import _ from "lodash";
import {
    Transaction,
    TxFunctions,
} from "../blockchain/block/transactions/transactions";
import { TxIn } from "../blockchain/block/transactions/txIn/txIn";
import { TxOut } from "../blockchain/block/transactions/txOut/txOut";
import { UnspentTxOut } from "../blockchain/block/transactions/unspentTxOut/unspentTxOut";

const EC: ec = new ec("secp256k1");
const privateKeyLocation: string =
    process.env.PRIVATE_KEY || "node/wallet/private_key";

export const getPrivateFromWallet = (): string => {
    const buffer = fs.readFileSync(privateKeyLocation, "utf8");
    return buffer.toString();
};

const generatePrivateKey = (): string => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

export const getPublicFromWallet = (): string => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex", false);
};

const initWallet = () => {
    if (fs.existsSync(privateKeyLocation)) {
        return;
    }
    const newPrivateKey: string = generatePrivateKey();

    fs.writeFileSync(privateKeyLocation, newPrivateKey);
    console.log(
        "new wallet with private key created to : %s",
        privateKeyLocation
    );
};

const getBalance = (address: string, unspentTxOuts: UnspentTxOut[]): number => {
    const balance = _(unspentTxOuts)
        .filter((uTxO: UnspentTxOut) => uTxO.address === address)
        .map((uTxO: UnspentTxOut) => uTxO.amount)
        .sum();
    return balance;
};

const filterTxPoolTxs = (
    unspentTxOuts: UnspentTxOut[],
    transactionPool: Transaction[]
): UnspentTxOut[] => {
    const txIns: TxIn[] = _(transactionPool)
        .map((tx: Transaction) => tx.txIns)
        .flatten()
        .value();
    const removable: UnspentTxOut[] = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn: TxIn) => {
            return (
                aTxIn.txOutIndex === unspentTxOut.txOutIndex &&
                aTxIn.txOutId === unspentTxOut.txOutId
            );
        });

        if (txIn === undefined) {
        } else {
            removable.push(unspentTxOut);
        }
    }

    return _.without(unspentTxOuts, ...removable);
};

const findTxOutsForAmount = (
    amount: number,
    myUnspentTxOuts: UnspentTxOut[]
) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }

    const eMsg =
        "Cannot create transaction from the available unspent transaction outputs." +
        " Required amount:" +
        amount +
        ". Available unspentTxOuts:" +
        JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};

const createTxOuts = (
    receiverAddress: string,
    myAddress: string,
    amount: any,
    leftOverAmount: number
) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

export const createTransaction = (
    txOutAddress: string,
    amount: number,
    privateKey: string,
    unspentTxOuts: UnspentTxOut[],
    txPool: Transaction[],
    txInAddress: string
): Transaction => {
    const myAddress: string = txInAddress;
    const myUnspentTxOutsA = unspentTxOuts.filter(
        (uTxO: UnspentTxOut) => uTxO.address === myAddress
    );
    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(
        amount,
        myUnspentTxOuts
    );
    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
        const txIn: TxIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);
    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(txOutAddress, myAddress, amount, leftOverAmount);
    tx.id = TxFunctions.getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = TxFunctions.signTxIn(
            tx,
            index,
            privateKey,
            unspentTxOuts
        );
        return txIn;
    });

    return tx;
};

initWallet();
