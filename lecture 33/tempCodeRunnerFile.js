const result = bcrypt.compare(password, hash).then((result) => {
//     console.log('Password match:', result);
// })