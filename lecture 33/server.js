const bcrypt = require('bcrypt');

const password = 'Pulkit@123';

const salt = bcrypt.genSaltSync(10);

const hash = bcrypt.hash(password, salt).then((hash) => {
    console.log('Hash:', hash);
})
console.log('Salt:', salt);
console.log('Hash:', hash);

// const result = bcrypt.compare(password, hash).then((result) => {
//     console.log('Password match:', result);
// })