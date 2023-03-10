import * as Json from './src/TSTypes.js';
import type { Signed, Network } from './src/TSTypes.js';
import * as TransactionJson from '../provable/gen/transaction-json.js';
export { Client as default };
declare class Client {
    private network;
    constructor(options: {
        network: Network;
    });
    /**
     * Generates a public/private key pair
     *
     * @returns A Mina key pair
     */
    genKeys(): Json.Keypair;
    /**
     * Verifies if a key pair is valid by checking if the public key can be derived from
     * the private key and additionally checking if we can use the private key to
     * sign a transaction. If the key pair is invalid, an exception is thrown.
     *
     * @param keypair A key pair
     * @returns True if the `keypair` is a verifiable key pair, otherwise throw an exception
     */
    verifyKeypair({ privateKey, publicKey }: Json.Keypair): boolean;
    /**
     * Derives the public key of the corresponding private key
     *
     * @param privateKey The private key used to get the corresponding public key
     * @returns A public key
     */
    derivePublicKey(privateKeyBase58: Json.PrivateKey): Json.PublicKey;
    /**
     * Signs an arbitrary message
     *
     * @param message An arbitrary string message to be signed
     * @param key The key pair used to sign the message
     * @returns A signed message
     */
    signMessage(message: string, key: Json.Keypair): Signed<Json.Message>;
    /**
     * Verifies that a signature matches a message.
     *
     * @param signedMessage A signed message
     * @returns True if the `signedMessage` contains a valid signature matching
     * the message and publicKey.
     */
    verifyMessage(signedMessage: Signed<Json.Message>): boolean;
    private normalizeCommon;
    /**
     * Signs a payment transaction using a private key.
     *
     * This type of transaction allows a user to transfer funds from one account
     * to another over the network.
     *
     * @param payment An object describing the payment
     * @param privateKey The private key used to sign the transaction
     * @returns A signed payment transaction
     */
    signPayment(payment: Json.Payment, privateKey: Json.PrivateKey): Signed<Json.Payment>;
    /**
     * Verifies a signed payment.
     *
     * @param signedPayment A signed payment transaction
     * @returns True if the `signed(payment)` is a verifiable payment
     */
    verifyPayment({ data, signature }: Signed<Json.Payment>): boolean;
    /**
     * Signs a stake delegation transaction using a private key.
     *
     * This type of transaction allows a user to delegate their
     * funds from one account to another for use in staking. The
     * account that is delegated to is then considered as having these
     * funds when determining whether it can produce a block in a given slot.
     *
     * @param stakeDelegation An object describing the stake delegation
     * @param privateKey The private key used to sign the transaction
     * @returns A signed stake delegation
     */
    signStakeDelegation(stakeDelegation: Json.StakeDelegation, privateKey: Json.PrivateKey): Signed<Json.StakeDelegation>;
    /**
     * Verifies a signed stake delegation.
     *
     * @param signedStakeDelegation A signed stake delegation
     * @returns True if the `signed(stakeDelegation)` is a verifiable stake delegation
     */
    verifyStakeDelegation({ data, signature, }: Signed<Json.StakeDelegation>): boolean;
    /**
     * Compute the hash of a signed payment.
     *
     * @param signedPayment A signed payment transaction
     * @returns A transaction hash
     */
    hashPayment({ data, signature }: Signed<Json.Payment>, options?: {
        berkeley?: boolean;
    }): string;
    /**
     * Compute the hash of a signed stake delegation.
     *
     * @param signedStakeDelegation A signed stake delegation
     * @returns A transaction hash
     */
    hashStakeDelegation({ data, signature }: Signed<Json.StakeDelegation>, options?: {
        berkeley?: boolean;
    }): string;
    /**
     * Sign a zkapp command transaction using a private key.
     *
     * This type of transaction allows a user to update state on a given
     * Smart Contract running on Mina.
     *
     * @param zkappCommand A object representing a zkApp command tx
     * @param privateKey The fee payer private key
     * @returns Signed ZkappCommand
     */
    signZkappCommand({ feePayer, zkappCommand }: Json.ZkappCommand, privateKey: Json.PrivateKey): Signed<Json.ZkappCommand>;
    /**
     * Converts a Rosetta signed transaction to a JSON string that is
     * compatible with GraphQL. The JSON string is a representation of
     * a `Signed_command` which is what our GraphQL expects.
     *
     * @param signedRosettaTxn A signed Rosetta transaction
     * @returns A string that represents the JSON conversion of a signed Rosetta transaction`.
     */
    signedRosettaTransactionToSignedCommand(signedRosettaTxn: string): string;
    /**
     * Return the hex-encoded format of a valid public key. This will throw an exception if
     * the key is invalid or the conversion fails.
     *
     * @param publicKey A valid public key
     * @returns A string that represents the hex encoding of a public key.
     */
    publicKeyToRaw(publicKeyBase58: string): string;
    /**
     * Signs an arbitrary payload using a private key. This function can sign messages,
     * payments, stake delegations, and zkapp commands. If the payload is unrecognized, an Error
     * is thrown.
     *
     * @param payload A signable payload
     * @param key A valid keypair
     * @returns A signed payload
     */
    signTransaction(payload: Json.SignableData, privateKey: Json.PrivateKey): Signed<Json.SignableData>;
    /**
     * Calculates the minimum fee of a zkapp command transaction. A fee for a zkapp command transaction is
     * the sum of all account updates plus the specified fee amount. If no fee is passed in, `0.001`
     * is used (according to the Mina spec) by default.
     * @param p An accountUpdates object
     * @param fee The fee per accountUpdate amount
     * @returns  The fee to be paid by the fee payer accountUpdate
     */
    getAccountUpdateMinimumFee(p: TransactionJson.AccountUpdate[], fee?: number): number;
}
