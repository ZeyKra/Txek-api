export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface ApiEndpoint {
  title: string
  method: HttpMethod
  path: string
  description: string
  requestBody?: string
  response: string
}

export interface ApiSection {
  title: string
  description: string
  endpoints: ApiEndpoint[]
}

export const apiDocumentation: ApiSection[] = [
  {
    title: "Utilisateurs",
    description: "Endpoints pour la gestion des utilisateurs du jeu de cartes.",
    endpoints: [
      {
        title: "Liste des utilisateurs",
        method: "GET",
        path: "/api/v1/users",
        description: "Récupère la liste de tous les utilisateurs.",
        response: "Tableau d'objets utilisateur",
      },
      {
        title: "Créer un utilisateur",
        method: "POST",
        path: "/api/v1/users",
        description: "Crée un nouvel utilisateur.",
        requestBody: `{
  "username": "joueur1",
  "email": "joueur1@example.com"
}`,
        response: "Objet utilisateur créé",
      },
      {
        title: "Détails d'un utilisateur",
        method: "GET",
        path: "/api/v1/users/{id}",
        description: "Récupère les détails d'un utilisateur spécifique.",
        response: "Objet utilisateur",
      },
      {
        title: "Mettre à jour un utilisateur",
        method: "PUT",
        path: "/api/v1/users/{id}",
        description: "Met à jour les informations d'un utilisateur.",
        requestBody: `{
  "username": "nouveauNom",
  "email": "nouveau@example.com"
}`,
        response: "Objet utilisateur mis à jour",
      },
      {
        title: "Supprimer un utilisateur",
        method: "DELETE",
        path: "/api/v1/users/{id}",
        description: "Supprime un utilisateur.",
        response: "Message de confirmation",
      },
    ],
  },
  {
    title: "Matchs",
    description: "Endpoints pour la gestion des matchs du jeu de cartes.",
    endpoints: [
      {
        title: "Liste des matchs",
        method: "GET",
        path: "/api/v1/matches",
        description: "Récupère la liste de tous les matchs.",
        response: "Tableau d'objets match",
      },
      {
        title: "Créer un match",
        method: "POST",
        path: "/api/v1/matches",
        description: "Crée un nouveau match.",
        requestBody: `{
  "players": ["id-joueur-1", "id-joueur-2"]
}`,
        response: "Objet match créé",
      },
      {
        title: "Détails d'un match",
        method: "GET",
        path: "/api/v1/matches/{id}",
        description: "Récupère les détails d'un match spécifique.",
        response: "Objet match",
      },
      {
        title: "Mettre à jour un match",
        method: "PATCH",
        path: "/api/v1/matches/{id}",
        description: "Met à jour les informations d'un match.",
        requestBody: `{
  "status": "in_progress"
}`,
        response: "Objet match mis à jour",
      },
      {
        title: "Supprimer un match",
        method: "DELETE",
        path: "/api/v1/matches/{id}",
        description: "Supprime un match.",
        response: "Message de confirmation",
      },
    ],
  },
  {
    title: "Rounds",
    description: "Endpoints pour la gestion des rounds de jeu.",
    endpoints: [
      {
        title: "Liste des rounds d'un match",
        method: "GET",
        path: "/api/v1/matches/{id}/rounds",
        description: "Récupère tous les rounds d'un match spécifique.",
        response: "Tableau d'objets round",
      },
      {
        title: "Créer un round",
        method: "POST",
        path: "/api/v1/matches/{id}/rounds",
        description: "Crée un nouveau round pour un match.",
        requestBody: `{
  "moves": [
    {
      "playerId": "id-joueur-1",
      "cardId": "id-carte-1",
      "timestamp": "2023-07-14T12:00:00Z"
    }
  ]
}`,
        response: "Objet round créé",
      },
      {
        title: "Détails d'un round",
        method: "GET",
        path: "/api/v1/matches/{id}/rounds/{roundId}",
        description: "Récupère les détails d'un round spécifique.",
        response: "Objet round",
      },
      {
        title: "Mettre à jour un round",
        method: "PATCH",
        path: "/api/v1/matches/{id}/rounds/{roundId}",
        description: "Met à jour les informations d'un round.",
        requestBody: `{
  "winner": "id-joueur-1",
  "moves": [
    {
      "playerId": "id-joueur-1",
      "cardId": "id-carte-1",
      "timestamp": "2023-07-14T12:00:00Z"
    },
    {
      "playerId": "id-joueur-2",
      "cardId": "id-carte-2",
      "timestamp": "2023-07-14T12:01:00Z"
    }
  ]
}`,
        response: "Objet round mis à jour",
      },
    ],
  },
]

