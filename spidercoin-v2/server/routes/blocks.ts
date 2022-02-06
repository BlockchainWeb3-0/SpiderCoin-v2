import express from "express";
import { Transaction } from "../blockchain/block/transactions/transactions";
import { chain } from "../blockchain/chain";
import * as config from "../config";
import { transactionPool } from "../transactionPool/transactionPool";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    res.send(chain);
});

router.post("/mineblock", (req, res) => {
    const address: string =
        "04cf239f05062e36972d490aa3253ac6f654e972b7499c1ea9c607098601dbe5671de1655623e9e13627631b3dcc968d27189225b1a6e82c9d8017e4d83ea4c202";
    const data: Transaction[] = chain.getBlockData(
        address,
        chain,
        transactionPool
    );
    const newBlock = chain.addBlock(data);
    console.log(data);
});

export = router;
