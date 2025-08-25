const db = require('../config/db');


module.exports = {

updatepassword: async (id, hashedPassword) => {
  return db.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, id]);
},

updateemail: async (id, newEmail) => {
  return db.query("UPDATE users SET email = encrypt($1, current_setting('app.encryption_key'), 'aes-cbc') WHERE user_id = $2", [newEmail, id]);
} ,

updatename : async (id, newName) => {
  return db.query('UPDATE users SET name = $1 WHERE user_id = $2' , [newName, id])
}

}
