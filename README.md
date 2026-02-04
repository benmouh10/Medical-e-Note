🏥 Medical eNote
Medical eNote est une application full-stack sécurisée dédiée à la gestion des notes médicales (diagnostics, prescriptions, pièces jointes). Elle permet aux professionnels de santé de centraliser les informations patients tout en garantissant une confidentialité maximale grâce au chiffrement des données sensibles.

🚀 Fonctionnalités Clés
🩺 Pour les Médecins
Gestion des Notes : Création et modification de notes de consultation (Diagnostic et Prescription).

Sécurité Clinique : Chiffrement automatique des diagnostics et prescriptions en base de données.

Pièces Jointes : Support pour l'ajout de documents médicaux (en cours de développement).

🛡️ Pour les Administrateurs
Tableau de Bord : Statistiques en temps réel sur le nombre de patients, médecins et notes créées.

Gestion des Utilisateurs : Recherche, modification des rôles (admin, medecin, en_attente) et activation/désactivation des comptes.

Logs & Historique : Suivi des actions effectuées sur la plateforme.

🛠️ Stack Technique
Frontend : Flutter (Multiplateforme : Android, iOS, Web)

Backend : Node.js avec Express.js

Base de Données : PostgreSQL avec l'extension pgcrypto

Authentification : JWT (JSON Web Tokens) & Shared Preferences

🔒 Sécurité & Chiffrement
Le point fort de ce projet est la protection des données via le chiffrement AES-CBC.

Chiffrement côté serveur : Les données sensibles sont chiffrées par PostgreSQL lors de l'insertion ou de la mise à jour.

Déchiffrement au vol : Seul le personnel autorisé (via l'API) peut récupérer les données en clair grâce à une clé d'encryption sécurisée.

SQL
-- Exemple de logique SQL utilisée
UPDATE notes 
SET diagnosis = encrypt($1, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')
WHERE note_id = $2;
📦 Installation
1. Backend (Node.js)
Accédez au dossier api/.

Installez les dépendances : npm install.

Configurez votre fichier .env (DB_URL, JWT_SECRET, ENCRYPTION_KEY).

Lancez le serveur : npm start.

2. Frontend (Flutter)
Assurez-vous d'avoir Flutter installé.

Exécutez flutter pub get pour installer les packages.

Lancez l'application : flutter run.

📂 Structure du Projet
/lib : Code source Flutter (Modèles, Services, Pages).

/backend : Logique API, Contrôleurs, Modèles SQL et Middlewares.

/assets : Images et configurations de thèmes (colors.dart).
