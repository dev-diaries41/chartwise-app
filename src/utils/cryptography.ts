import crypto from 'crypto'

// Symmetric encryption
export function symmetricEncrypt(message: string, myKey = null) {
    const key = myKey || crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encryptedMessage = cipher.update(message, 'utf-8', 'hex') + cipher.final('hex');
    const tag = cipher.getAuthTag();

    return {
        encryptedMessage,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        key: key.toString('hex')
    };
}

// Asymmetric encryption
export function rsaEncrypt(publicKey: crypto.RsaPrivateKey | crypto.KeyLike | crypto.RsaPublicKey, data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>){
    return crypto.publicEncrypt(publicKey, Buffer.from(data));
}


// Symmetric decryption
export function symmertricDecrypt(encryptedMessage: any, iv: any, tag: any, key: any) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf-8');
    return decryptedMessage;
}

// Asymmetric decryption
export function rsaDecrypt(privateKey: crypto.RsaPrivateKey | crypto.KeyLike, encryptedData: NodeJS.ArrayBufferView){
    return crypto.privateDecrypt(privateKey,encryptedData).toString('utf-8');
}


// General purpose hasing
export function hash(valueToHash: string){
    return crypto.createHash('sha512').update(valueToHash).digest('hex');
}

export function hmacHash(key: any, valueToHash: string){
    return crypto.createHmac('sha512', key).update(valueToHash).digest('hex');
}

// For secure password hashing
export function hashPassword(password: string, salt: any){
    const hashedPassword = crypto.scryptSync(password, salt, 64);
    return hashedPassword;
}


export function genKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: passphrase 
        }
    });
    return { publicKey, privateKey };
}


export function signMessage(privateKey: crypto.KeyLike | crypto.SignKeyObjectInput | crypto.SignPrivateKeyInput, message: crypto.BinaryLike){
    const signer = crypto.createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(privateKey, 'hex');
    return {message, signature};
}

export function verifyMessage(publicKey: crypto.KeyLike | crypto.VerifyKeyObjectInput | crypto.VerifyPublicKeyInput | crypto.VerifyJsonWebKeyInput, message: crypto.BinaryLike, signature: string){
    const verifier = crypto.createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(publicKey, signature, 'hex');
    return {message, isVerified};
}
