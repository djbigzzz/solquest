const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

/**
 * Get Solana connection based on environment
 * @returns {Connection} Solana connection
 */
const getSolanaConnection = () => {
  const network = process.env.SOLANA_NETWORK || 'devnet';
  return new Connection(clusterApiUrl(network));
};

/**
 * Verify a Solana wallet signature
 * @param {String} message - Message that was signed
 * @param {String} signature - Signature in base58 format
 * @param {String} publicKey - Public key in base58 format
 * @returns {Boolean} Whether the signature is valid
 */
const verifySignature = (message, signature, publicKey) => {
  try {
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);
    
    // Convert signature from base58 to Uint8Array
    const signatureBytes = bs58.decode(signature);
    
    // Convert public key from base58 to Uint8Array
    const publicKeyBytes = new PublicKey(publicKey).toBytes();
    
    // Verify the signature
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Generate a random nonce for authentication
 * @returns {String} Random nonce
 */
const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

/**
 * Create authentication message for signing
 * @param {String} nonce - Random nonce
 * @returns {String} Message to sign
 */
const createAuthMessage = (nonce) => {
  return `Sign this message to authenticate with SolQuest: ${nonce}`;
};

module.exports = {
  getSolanaConnection,
  verifySignature,
  generateNonce,
  createAuthMessage
};
