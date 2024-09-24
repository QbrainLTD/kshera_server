const bcrypt = require("bcryptjs");

const generateUserPassword = (password) => bcrypt.hashSync(password, 10);

const comaprePasswords = (password, cryptPassword) => {
  return bcrypt.compareSync(password, cryptPassword);
};

module.exports = { generateUserPassword, comaprePasswords };
