const crypto = require('crypto')

const algorithm = 'aes-256-cbc'
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
const iv = crypto.randomBytes(16)

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    }
}


function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encrypted.iv, 'hex'))
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

module.exports = { encrypt, decrypt }