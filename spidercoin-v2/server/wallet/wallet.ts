import { ec } from "elliptic";
import fs from "fs";

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

initWallet();
