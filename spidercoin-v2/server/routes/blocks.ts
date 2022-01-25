import express from "express";
import { chain } from "../blockchain/chain";
import * as config from "../config";

const router: express.Router = express.Router();

router.get("/", (req, res) => {
    chain.addBlock([config.GENESIS_TRANSACTION]);
    console.log(chain);
    res.send("welcome block page");
});

export = router;
