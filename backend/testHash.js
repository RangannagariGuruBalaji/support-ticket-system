const bcrypt = require('bcrypt');

const hash = bcrypt.hashSync('password123', 10);
console.log('HASH:', hash);
console.log('COMPARE password123:', bcrypt.compareSync('password123', hash));
