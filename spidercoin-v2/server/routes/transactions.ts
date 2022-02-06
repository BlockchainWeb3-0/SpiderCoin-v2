import express from "express";
import { unspentTxOuts } from "../blockchain/block/transactions/transactions";
import { chain } from "../blockchain/chain";
import { transactionPool } from "../transactionPool/transactionPool";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    //res.send(chain);
});
router.post("/addtransaction", (req, res) => {
    try {
        interface TxData {
            TxInAddress: string;
            TxOutAddress: string;
            sign: string;
            amount: number;
        }
        const { TxInAddress, TxOutAddress, sign, amount }: TxData = req.body;
        if (
            TxInAddress === undefined ||
            TxOutAddress == undefined ||
            amount == undefined ||
            sign === undefined
        ) {
            res.status(404).send({
                error: "Invalid TxInAddress or TxOutAddress or amount or sign",
                message:
                    "Invalid TxInAddress or TxOutAddress or amount or sign",
            });
            // throw Error(
            //     "Invalid TxInAddress or TxOutAddress or amount or sign"
            // );
        }
        if (unspentTxOuts === null) {
            res.status(404).send("Invalid unspentTxOuts");
            throw Error("Invalid unspentTxOuts");
        } else {
            const newTransaciton = chain.(
                TxOutAddress,
                amount,
                sign,
                unspentTxOuts,
                transactionPool,
                TxInAddress
            );
            res.send({ newTransaciton, message: "success" });
        }
    } catch (error) {}
});

export = router;
