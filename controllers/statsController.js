const db = require('../config/db');

exports.getStats = async (req, res) => {
  const patients = await db.query("SELECT COUNT(*) FROM patients");
  const notes = await db.query("SELECT COUNT(*) FROM notes");
  const doctors = await db.query("SELECT COUNT(*) FROM users WHERE role=$1",['medecin']);
  const admins = await db.query("SELECT COUNT(*) FROM users WHERE role=$1",['admin']);
  res.json({ totalAdmins: admins.rows[0].count, totalDoctors: doctors.rows[0].count, totalPatients: patients.rows[0].count, totalNotes: notes.rows[0].count });
};

exports.getmystats = async (req, res) => {
  const patients = await db.query("SELECT COUNT(*) FROM patients WHERE created_by =$1",[req.auth.id]);
  const notes = await db.query("SELECT COUNT(*) FROM notes WHERE created_by =$1",[req.auth.id]);
  res.json({ totalPatients: patients.rows[0].count, totalNotes: notes.rows[0].count });
};