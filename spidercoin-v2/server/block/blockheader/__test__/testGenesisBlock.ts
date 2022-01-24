import { BlockHeader } from "../blockheader";
import merkle from "merkle";
import * as config from "../../../config";

export const genesisBlock: BlockHeader = new BlockHeader(
    BlockHeader.getVersion(),
    0,
    "0".repeat(64),
    merkle("sha256")
        .sync([JSON.stringify(config.GENESIS_TRANSACTION)])
        .root() || "0".repeat(64),
    1631006505,
    config.INITIAL_DIFFICULTY,
    2083236893
);
