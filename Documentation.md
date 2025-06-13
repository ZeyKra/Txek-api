# Documentation API Txek

## Vue d'ensemble

Cette API RESTful fournit les services backend pour l'application de jeu de cartes Txek. Elle permet la gestion des utilisateurs, l'authentification, la gestion des matchs et des rounds de jeu.

## URL de base

```
http://localhost:3000/api
```

## Authentification

L'API utilise l'authentification par token JWT (JSON Web Token). Pour accéder aux endpoints protégés, incluez le token dans l'en-tête de la requête :

```
Authorization: Bearer <votre_token_jwt>
```

## Endpoints

### Authentification

#### POST /auth/token
Récupération ou validation d'un token d'authentification.

**Réponse (200) :**
```json
{
  "token": "jwt_token",
  "expires_in": 86400
}
```

### Santé de l'API

#### GET /health
Vérification de l'état de santé de l'API.

**Réponse (200) :**
```json
{
  "status": "OK",
  "timestamp": "2025-06-12T10:00:00.000Z"
}
```

### Gestion des utilisateurs

#### GET /protected/user/{userId}
Récupération des informations d'un utilisateur spécifique (nécessite l'authentification).

**Paramètres :**
- `userId` : Identifiant de l'utilisateur

**Réponse (200) :**
```json
{
  "id": "RecordedUser:user_id",
  "username": "nom_utilisateur",
  "email": "utilisateur@exemple.com",
  "created_at": "2025-06-12T10:00:00.000Z"
}
```

#### GET /protected/user/{userId}/history
Récupération de l'historique des matchs d'un utilisateur (nécessite l'authentification).

**Paramètres :**
- `userId` : Identifiant de l'utilisateur

**Réponse (200) :**
```json
{
  "matches": [
    {
      "id": "Match:match_id",
      "created_at": "2025-06-12T10:00:00.000Z",
      "completed_at": "2025-06-12T11:00:00.000Z",
      "status": "completed",
      "winner": "RecordedUser:user_id",
      "round_max": 3
    }
  ]
}
```

### Gestion des matchs

#### POST /protected/matches
Création d'un nouveau match (nécessite l'authentification).

**Corps de la requête :**
```json
{
  "owner_id": "user_id",
  "players": ["player1", "player2"],
  "round_max": 3,
  "created_at": "2025-06-12T10:00:00.000Z",
  "winner": "player1"
}
```

**Réponse (201) :**
```json
{
  "id": {
    "tb": "Match",
    "id": "match_id"
  },
  "created_at": "2025-06-12T10:00:00.000Z",
  "completed_at": "2025-06-12T11:00:00.000Z",
  "players": ["player1", "player2"],
  "status": "created",
  "round_max": 3,
  "winner": "player1"
}
```

#### GET /protected/matches/{matchId}
Récupération des détails d'un match spécifique (nécessite l'authentification).

**Paramètres :**
- `matchId` : Identifiant du match

**Réponse (200) :**
```json
{
  "id": "Match:match_id",
  "created_at": "2025-06-12T10:00:00.000Z",
  "completed_at": "2025-06-12T11:00:00.000Z",
  "players": ["player1", "player2"],
  "status": "completed",
  "round_max": 3,
  "winner": "player1"
}
```

### Gestion des rounds

#### GET /protected/matches/{matchId}/rounds
Récupération de tous les rounds d'un match (nécessite l'authentification).

**Paramètres :**
- `matchId` : Identifiant du match

**Réponse (200) :**
```json
{
  "rounds": [
    {
      "id": "Round:round_id",
      "round_index": 1,
      "status": "completed",
      "winner": "player1",
      "created_at": "2025-06-12T10:00:00.000Z"
    }
  ]
}
```

#### POST /protected/matches/{matchId}/rounds/filled
Création d'un round avec des données complètes (nécessite l'authentification).

**Paramètres :**
- `matchId` : Identifiant du match

**Corps de la requête :**
```json
{
  "round_index": 1,
  "winner": "player1",
  "created_at": "2025-06-12T10:00:00.000Z",
  "player1": ["Card:1", "Card:2"],
  "player2": ["Card:3", "Card:4"]
}
```

**Réponse (201) :**
```json
{
  "id": {
    "tb": "Round",
    "id": "round_id"
  },
  "round_index": 1,
  "status": "completed",
  "winner": "player1",
  "created_at": "2025-06-12T10:00:00.000Z"
}
```

#### GET /protected/matches/{matchId}/rounds/{roundId}
Récupération des détails d'un round spécifique (nécessite l'authentification).

**Paramètres :**
- `matchId` : Identifiant du match
- `roundId` : Identifiant du round

**Réponse (200) :**
```json
{
  "id": "Round:round_id",
  "round_index": 1,
  "status": "completed",
  "winner": "player1",
  "created_at": "2025-06-12T10:00:00.000Z"
}
```

#### PATCH /protected/matches/{matchId}/rounds/{roundId}
Modification des informations d'un round (nécessite l'authentification).

**Paramètres :**
- `matchId` : Identifiant du match
- `roundId` : Identifiant du round

**Corps de la requête :**
```json
{
  "winner": "player2",
  "status": "completed"
}
```

**Réponse (200) :**
```json
{
  "message": "Round mis à jour avec succès",
  "round": {
    "id": "Round:round_id",
    "round_index": 1,
    "status": "completed",
    "winner": "player2"
  }
}
```

### Données protégées

#### GET /protected/data
Récupération de données générales protégées (nécessite l'authentification).

**Réponse (200) :**
```json
{
  "data": "Données protégées de l'application",
  "timestamp": "2025-06-12T10:00:00.000Z"
}
```

## Codes de statut HTTP

- **200 OK** : Requête réussie
- **201 Created** : Ressource créée avec succès
- **400 Bad Request** : Données de requête invalides
- **401 Unauthorized** : Authentification requise ou token invalide
- **403 Forbidden** : Accès refusé
- **404 Not Found** : Ressource non trouvée
- **422 Unprocessable Entity** : Erreur de validation des données
- **500 Internal Server Error** : Erreur serveur

## Format des erreurs

Les erreurs sont retournées au format JSON suivant :

```json
{
  "error": "Message d'erreur descriptif"
}
```

### Exemples d'erreurs courantes

- **400 Bad Request** : `{ "error": "Un match doit avoir un Proprietaire" }`
- **400 Bad Request** : `{ "error": "Un round doit avoir un index" }`
- **404 Not Found** : `{ "error": "Utilisateur inexistant" }`
- **500 Internal Server Error** : `{ "error": "Erreur lors de la création du match" }`

## Exemples d'utilisation

### Création d'un match complet

1. **Créer un match :**
```bash
curl -X POST http://localhost:3000/api/protected/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer votre_token_jwt" \
  -d '{
    "owner_id": "user_123",
    "players": ["joueur1", "joueur2"],
    "round_max": 3
  }'
```

2. **Créer un round avec données :**
```bash
curl -X POST http://localhost:3000/api/protected/matches/match_123/rounds/filled \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer votre_token_jwt" \
  -d '{
    "round_index": 1,
    "winner": "joueur1",
    "joueur1": ["Card:1", "Card:2"],
    "joueur2": ["Card:3", "Card:4"]
  }'
```

3. **Récupérer l'historique d'un utilisateur :**
```bash
curl -X GET http://localhost:3000/api/protected/user/user_123/history \
  -H "Authorization: Bearer votre_token_jwt"
```

## Validation des données

### Règles de validation

- **owner_id** : Obligatoire pour la création de match
- **round_index** : Obligatoire pour la création de round
- **matchId/roundId** : Format d'identifiant valide requis
- **created_at** : Format ISO 8601 ou génération automatique

## Architecture de données

### Structure des entités

#### Match
```typescript
{
  id: string,
  created_at: Date,
  completed_at: Date,
  players: string[],
  status: "created" | "in_progress" | "completed",
  round_max: number,
  winner?: string
}
```

#### Round
```typescript
{
  id: string,
  created_at: Date,
  status: "completed" | "in_progress",
  round_index: number,
  winner?: string
}
```

#### User
```typescript
{
  id: string,
  username: string,
  email: string,
  created_at: Date
}
```

## Sécurité

- Tous les endpoints `/protected/*` nécessitent une authentification JWT
- Validation stricte des données d'entrée
- Relations sécurisées entre les entités (Match, Round, User)
- Protection contre les accès non autorisés aux données utilisateur

## Base de données

L'API utilise SurrealDB comme base de données avec les tables principales :
- `RecordedUser` : Gestion des utilisateurs
- `Match` : Gestion des matchs
- `Round` : Gestion des rounds
- Relations entre les entités via des liens SurrealDB

## Variables d'environnement

Assurez-vous que les variables suivantes sont configurées :

```env
PORT=3000
JWT_SECRET=votre_secret_jwt
SURREAL_DB_URL=votre_url_surrealdb
SURREAL_DB_USER=votre_utilisateur_db
SURREAL_DB_PASS=votre_mot_de_passe_db
```

## Documentation interactive

Une documentation interactive est disponible à l'adresse :
```
http://localhost:3000/documentation
```

Cette interface permet de visualiser tous les endpoints disponibles avec leurs descriptions et exemples.

## Notes de version

### Version 1.0.0
- Authentification JWT
- Gestion des utilisateurs et historiques
- Gestion complète des matchs et rounds
- API de santé et données protégées
- Documentation interactive
- Intégration SurrealDB

---

*Documentation mise à jour le 12 juin 2025*