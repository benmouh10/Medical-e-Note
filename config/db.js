const { Pool } = require('pg') ; 
require('dotenv').config() ; 

const pool = new Pool ( {
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
} ) ; 

pool.connect()
    .then(client => {
        return client.query(`SET app.encryption_key TO '${process.env.ENCRYPTION_KEY}';`)
            .then(() => {
                client.release();
                console.log("Clé de chiffrement de session définie.");
            })
            .catch(err => {
                client.release();
                console.error("Erreur lors de la définition de la clé de chiffrement:", err);
            });
    })
    .catch(err => {
        console.error("Erreur de connexion à la base de données:", err);
    });
    
    
    
    module.exports = pool;