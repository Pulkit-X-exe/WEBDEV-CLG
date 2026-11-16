const jwt = require('jsonwebtoken');

const data = {
    id: 10
};

const secret = "adefsfrgrrrewer";

// Generate token
const token = jwt.sign(data, secret, { expiresIn: '1h' });

console.log('Token:', token);

// Verify the token
const decoded = jwt.verify(token, secret);

console.log('Decoded:', decoded);