const crypto = require('crypto');

// https://attacomsian.com/blog/nodejs-encrypt-decrypt-data

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);
const encrypt = (secretKey, text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (secretKey, hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};

//you can use any 32 byte string to encrypt credentials
//let t = encrypt("12345678901234567890123456789012","dinges")
//console.log(t)