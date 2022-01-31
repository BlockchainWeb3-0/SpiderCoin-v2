/**
 * TxIn : Transaction Input
 * Transaction Output을 참조한다.
 * privatekey를 통해 signature가 들어간다.
 */
export class TxIn {
    txOutId: string;
    txOutIndex: number;
    signature: string;
}
