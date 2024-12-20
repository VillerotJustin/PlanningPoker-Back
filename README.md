# API Express avec WebSocket

Ce projet est une API Express.js intégrée avec une fonctionnalité WebSocket, conçue pour fournir un backend à une application de poker. L'application repose sur une base de données SQL et dispose de configurations d'environnement spécifiques pour fonctionner correctement.

## Commencer

### Prérequis

Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v14 ou supérieur recommandé)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- Serveur MySQL

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/VillerotJustin/PlanningPoker-Back/
   cd PlanningPoker-Back
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre fichier `.env` avec le format suivant :
   ```env
   DB_HOST=localhost
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_DATABASE=poker
   API_PORT=3000
   SOCKET_PORT=3001
   ```
   > **Remarque :** Modifier les valeurs de `API_PORT` et `SOCKET_PORT` peut provoquer des dysfonctionnements du frontend. Vérifiez la compatibilité avant de les changer.

4. Initialisez la base de données (si nécessaire) :
   Importez le schéma ou les migrations requis dans votre base de données SQL. Ce processus dépend de la structure de votre base de données.
   Si vous n'avez pas de donné a initialiser vous meme l'API initialisara elle même la structure de la BDD.

### Lancer l'application

1. Démarrez le serveur API :
   ```bash
   nodejs app.js
   ```

2. Accédez à l'API à `http://localhost:3000` (ou la valeur définie dans `API_PORT`).

3. Les connexions WebSocket seront disponibles sur le port spécifié dans `SOCKET_PORT` (par défaut : 3001).

## Endpoints de l'API

L'API fournit les endpoints suivants :

### Endpoints
Référez vous a la swaggerDoc

## Intégration WebSocket

Le serveur WebSocket est configuré pour gérer les communications en temps réel pour l'application de poker. Assurez-vous que votre frontend se connecte au bon `SOCKET_PORT` pour un fonctionnement sans accroc.

### Événements WebSocket Exemple :
- **Connexion établie :** Notifie lorsqu'un client se connecte.
- **Mise à jour de la partie :** Envoie des mises à jour sur les parties de poker en cours.
- **Action du joueur :** Reçoit les actions des joueurs (ex. : vote, envoye un message, résultat de vote).

## Variables d'environnement

L'application repose sur les variables d'environnement suivantes :

| Variable      | Description                              | Valeur par défaut |
|---------------|------------------------------------------|-------------------|
| `DB_HOST`     | Nom d'hôte ou IP du serveur de base de données | `localhost`       |
| `DB_USER`     | Nom d'utilisateur de la base de données         | `root`            |
| `DB_PASSWORD` | Mot de passe de la base de données             | `password`        |
| `DB_DATABASE` | Nom de la base de données                   | `poker`           |
| `API_PORT`    | Port du serveur API                      | `3000`            |
| `SOCKET_PORT` | Port du serveur WebSocket                | `3001`            |

> Modifier `API_PORT` ou `SOCKET_PORT` pourrait interrompre le fonctionnement du frontend. Assurez-vous de la compatibilité entre le backend et le frontend.


## Test

Vous pouvez lancer les test de l'application avec :
```bash
   npm run test
```
