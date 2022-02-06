import {
    Transaction,
    TxFunctions,
} from "./blockchain/block/transactions/transactions";

export const INITIAL_DIFFICULTY: number = 3;

export const BLOCK_GENERATION_INTERVAL: number = 10; // number of blocks
export const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10; // seconds
export const MINE_INTERVAL: number =
    BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL; // seconds

export const INITAIL_BALANCE: number = 1000;

export const COINBASE_AMOUNT: number = 50;

export const GENESIS_TRANSACTION: Transaction = {
    txIns: [{ signature: "", txOutId: "", txOutIndex: 0 }],
    txOuts: [
        {
            address:
                "04cf239f05062e36972d490aa3253ac6f654e972b7499c1ea9c607098601dbe5671de1655623e9e13627631b3dcc968d27189225b1a6e82c9d8017e4d83ea4c202",
            amount: 50,
        },
    ],
    id: "625d384d04f3f988494c791c2d06c78963ba29e0b9854588de62a53709519b25",
};
