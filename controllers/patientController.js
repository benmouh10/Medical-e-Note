const Patient = require( '../models/Patient' ) ;
const logger = require('../services/loggingService');
const cryptoService = require('../services/cryptoService');

exports.getPatients = async ( req, res ) => {
    try {
       const id = req.auth.id ;
       console.log(id);
        const result = await Patient.getAll(id) ;
        if ( result.rows.length === 0 ) {
            res.status(404).json( { error : "Patient introuvable." } ) ;
         } else {
           /* result.rows = result.rows.map(r => ({
              ...r,
              phone : cryptoService.decrypt(r.phone)
            }));*/
            logger.logAction(id,'searched for ',{ patient : `ALL`} );
            res.json(result.rows) ;
         }
        } catch ( error ) {
            res.status(500).json(error);
        } 
}

exports.getAPatient = async ( req, res ) => {
    const id = req.params.id ; 
    const user_id = req.auth.id ;
    
    try {
        const result = await Patient.getone(user_id,id);
        if ( result.rows.length === 0 ) {
            res.status(404).json( { error : "Patient introuvable." } ) ;
        } else {
            logger.logAction(user_id,'searched for ' , { patient : `${id}`} );
            /*result.rows = result.rows.map(r => ({
              ...r,
              phone : cryptoService.decrypt(r.phone)
            }));*/
            res.json( result.rows[0] ) ;
        }
    } catch ( error ) {
        res.status(500).json(error) ;
    }
}

exports.updateAPatient = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.auth.id;
    const updateData = req.body;
    

    const result = await Patient.update(id, updateData, user_id);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: "Patient introuvable pour mise à jour." });
    }

    logger.logAction(user_id, 'UPDATED ', {patient : `${id}`});
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatients = async ( req, res ) => {
    try {
        const user_id = req.auth.id ;
        const result = await Patient.deleteAll(user_id) ;
        res.json( { message : "Touts les patients ont été supprimés."} ) ;
    } catch ( error ) {
        logger.logAction(user_id,'DELETED ', {patient : "ALL"});
        res.status(500).json(error) ;
    }
}

exports.deleteAPatient = async (req, res) => {
  try {
    const user_id = req.auth.id;
    const result = await Patient.deleteone(req.params.id, user_id); // <=== capture le résultat

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Patient introuvable à supprimer." });
    } else {
      logger.logAction(user_id, 'DELETED ', { patient: `${req.params.id}` });
      res.json({ message: `Patient ${req.params.id} supprimé.` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createPatient = async ( req, res ) => {
    try {
        const created_by = req.auth.id ;
        const {name, date_of_birth, gender, created_at, phone} = req.body;
        const result = await Patient.create( created_by , req.body ) ;

        logger.logAction(req.auth.id, 'CREATED', { patient: name });   /// ajouter le id plutot
        res.status(209).json({message : ('patient creé')});
        res.status(201).json(result) ;
    } catch ( error ) {
        res.status(500).json(error) ;
    }
};

exports.searchPatientsbyname = async (req, res) => {
    try {
        user_id = req.auth.id ;
        const { name = '', page = 1, limit = 10, sort = 'ASC' } = req.query;
        const result = await Patient.searchbyname({ user_id, name, page, limit, sort });
        logger.logAction(req.auth.id, 'SEARCHED FOR ', { patient : name});  /// ajouter l id plutot  
        /*result.rows = result.rows.map(r => ({
              ...r,
              phone : cryptoService.decrypt(r.phone)
            }));*/
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.searchPatientsbyphone = async (req, res) => {
    try {
        user_id = req.auth.id ;
        const { phone = '', page = 1, limit = 10, sort = 'ASC' } = req.query;
        const result = await Patient.searchbyphone({ user_id, phone, page, limit, sort });
        logger.logAction(req.auth.id, 'SEARCHED FOR ', { patient : phone});  /// ajouter l id plutot  
        /*result.rows = result.rows.map(r => ({
              ...r,
              phone : cryptoService.decrypt(r.phone)
            }));*/
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
};