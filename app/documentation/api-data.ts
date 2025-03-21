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
    title: "Joueurs",
    description: "Endpoints pour la gestion des Joueurs de Txek.",
    endpoints: [
      {
        title: "Liste des Joueurs",
        method: "GET",
        path: "/api/v1/player",
        description: "Récupère la liste de tous les joueurs.",
        response: "Tableau d'objets joueurs",
      },
      {
        title: "Créer un joueur",
        method: "POST",
        path: "/api/v1/player",
        description: "Crée un nouveau joueur.",
        requestBody: `{
  "username": "joueur1"
}`,
        response: "Objet Joueur créé",
      },
      {
        title: "Détails d'un joueur",
        method: "GET",
        path: "/api/v1/users/{id}",
        description: "Récupère les détails d'un joueur spécifique.",
        response: "Objet joueur",
      },
      {
        title: "Mettre à jour un joueur",
        method: "PUT",
        path: "/api/v1/users/{id}",
        description: "Met à jour les informations d'un joueur.",
        requestBody: `{
  "username": "nouveauNom",
  "email": "nouveau@example.com"
}`,
        response: "Objet joueur mis à jour",
      },
      {
        title: "Supprimer un joueur",
        method: "DELETE",
        path: "/api/v1/users/{id}",
        description: "Supprime un joueur.",
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
  "local_player": ["Joueur1", "Joueur2"],
  "owner": "Player:<id>",
  "round_max": number
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
        description: "Crée un nouveau round pour le match {id}.",
        requestBody: `{
  "round_index": number,
  "player": ["Player:<i>"]
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

