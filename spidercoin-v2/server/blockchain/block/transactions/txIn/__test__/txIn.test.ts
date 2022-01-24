import { TxIn } from "../txIn";

describe("transactionIn test", () => {
    beforeEach(() => {
        const data: TxIn = {
            txOutId:
                "5ce8725bd98518ec7dbc215ada714436e49019c678da0ac2ab730a04e9442e09",
            txOutIndex: 0,
            signature:
                "304502204f616cd856e643c1ee5ffe531f19e40af2dfacab8c7107871de0e1d5f881d068022100d294b2757977142961129153e77a8afc077dcd28e12030742d68c09876643f1d",
        };
    });
    test("test validate of txIn", () => {});
});
