import { Keypair } from '@solana/web3.js';
import { Rpc, createRpc } from '@lightprotocol/stateless.js';
import { createMint } from '@lightprotocol/compressed-token';
import {
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token";


/// Create RPC Connection
const RPC_ENDPOINT = 'https://mainnet.helius-rpc.com?api-key=<api_key>';
const connection: Rpc = createRpc(RPC_ENDPOINT);
const PAYER = Keypair.fromSecretKey(<private_key>);

(async() => {
   
    /// Create an SPL mint + register it for compression.
    const { mint, transactionSignature } = await createMint(
        connection,
        PAYER,
        PAYER.publicKey,
        9,
        PAYER,
    );
    console.log(`create-mint success! txId: ${transactionSignature}`);


    /// Create an associated SPL token account for the sender (PAYER)
    const ata = await getOrCreateAssociatedTokenAccount(
        connection,
        PAYER,
        mint,
        PAYER.publicKey
    );
    console.log(`ATA: ${ata.address.toBase58()}`);



    /// Mint SPL tokens to the sender
    const mintToTxId = await mintTo(
        connection,
        PAYER,
        mint,
        ata.address,
        PAYER.publicKey,
        1e9 * 1e9 // 1b * decimals
      );
    console.log(`mint-to success! txId: ${mintToTxId}`);
})();