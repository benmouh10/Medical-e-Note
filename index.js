require('dotenv').config() ;
console.log("Valeur de la clé de chiffrement:", process.env.ENCRYPTION_KEY);

const express = require('express') ;
const cors = require('cors') ;
const app = express() ;
const cookieParser = require('cookie-parser') ;

const helmet = require('helmet');
app.use(helmet());

const corsOptions = {
  origin: ['https://ton-front.example.com'], // ou ['http://localhost:3000'] en dev
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
};


app.use( cors(/*corsOptions*/ ) ) ; 
app.use(cookieParser());
app.use( express.json() ) ;


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const patientRoutes = require('./routes/patientRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/stats', statsRoutes);


const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const i18n = require('i18n');
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/locales',
  defaultLocale: 'fr',
});
app.use(i18n.init);



app.listen(process.env.PORT, () => {
    console.log(`API en cours sur le port ${process.env.PORT}`) ;
} )
