import Surreal from "surrealdb"
import { Player } from "@/app/types/player"
import { SurrealResponse } from "@/app/types/surreal-response"
import { Round } from "@/app/types/round"
import { Match } from "../types/match"

interface ConnectionSettings {
    url: string 
    namespace: string
    database: string
    username: string
    password: string
}
const settings: ConnectionSettings = {
    url: process.env.SURREAL_URL || "",
    namespace: process.env.SURREAL_NAMESPACE || "",
    database: process.env.SURREAL_DATABASE || "",
    username: process.env.SURREAL_USERNAME || "",
    password: process.env.SURREAL_PASSWORD || "",
  }

// Initialize SurrealDB client
export async function getSurrealClient() {
    if (!settings.url) {
      throw new Error("SurrealDB connection settings not configured")
    }
  
    const db = new Surreal()
  
    try {
      // Connect to the database
      await db.connect(settings.url)
  
      // Sign in as a user 
      await db.signin({
        username: settings.username,
        password: settings.password,
      })
  
      // Select a specific namespace and database 
      await db.use({ namespace: settings.namespace, database: settings.database})
  
      return db
    } catch (error) {
      console.error("Failed to connect to SurrealDB:", error)
      throw new Error("Failed to connect to SurrealDB")
    }
}
  
/**
 * Recuperer les informations d'un Joueur
 * @param playerId 
 * @returns 
 */
export async function getDatabasePlayerInformations(playerId: string) {
    const db = await getSurrealClient()

    try {
        const playersInformations: SurrealResponse<any> = await db.query(`SELECT * FROM Player:${playerId};`)
        db.close();
        return playersInformations[0][0]
    } catch(error) {
        console.error("Failed to get player informations:", error)
        throw new Error("Failed to get player informations")
    } 
}

/**
 * Creer un joueur dans la base de données
 * @param playerId 
 * @returns 
 */
export async function createPlayer(playerData: Player) {
    const db = await getSurrealClient()

    try {
        const playerCreation: SurrealResponse<any> = await db.query(`CREATE Player SET username = ${JSON.stringify(playerData.username)}, created_at = time::now();`)
        db.close();
        return playerCreation[0][0]
    } catch(error) {
        console.error("Failed to create player ", error)
        throw new Error("Failed to get player")
    } 
}

export async function createMatch(matchData: Match) {
    const db = await getSurrealClient()

    try {
        const matchCreation: SurrealResponse<any> = await db.query(`CREATE ONLY Match CONTENT $item`, {item: matchData})

        db.close();
        return matchCreation[0]
    } catch(error) {
        console.error("Failed to create Match:", error)
        throw new Error("Failed to create Match")
    }
}

/**
 * Crée un nouveau round dans la base de données et le relie à un match existant
 * @param matchId - L'identifiant du match auquel le round sera relié
 * @param roundData - Les données du round à créer
 * @returns Les données du round créé
 * @throws {Error} Si la création du round ou la relation échoue
 */

export async function createRound(roundData: Round) {
    const db = await getSurrealClient()

    try {

        const roundCreationData: SurrealResponse<any> = await db.query(`CREATE ONLY Round CONTENT $item`, {item: roundData})
        
        //const relationCreattion: SurrealResponse<any> = await db.query(`RELATE Round:${roundCreationData[0][0].id}->belongs_to_match->Match:${matchId} `)
        db.close();
        return roundCreationData[0]
    } catch(error) {
        console.error("Failed to create Round:", error)
        throw new Error("Failed to create Round")
    } 
}

export async function relateRoundToMatch(matchId: string, roundId: string) {
    const db = await getSurrealClient()

    try {
        const relationCreattion: SurrealResponse<any> = await db.query(`RELATE Round:${roundId}->belongs_to_match->Match:${matchId} `)
        db.close();
        return relationCreattion[0][0]  
    } catch(error) {
        console.error("Failed to create Round:", error)
        throw new Error("Failed to create Round")
    }
}

export async function generateRoundRelationContent(matchId: string) {
    const db = await getSurrealClient();

    try {
        const matchInformations: SurrealResponse<any> = await getMatchInformations(matchId);

        console.log("matchInformations:", matchInformations); // DEBUG
        
        const roundRelationContent = {
            local_player: matchInformations[0].local_player
        }

        db.close();
        //return roundRelationContent
        
    } catch(error) {
        console.error("Failed to generate round relation cotent:", error)
        throw new Error("Failed to generate round relation content")
    }
    
}

/**
 * Recuperer les informations d'un match
 * @param matchId
 * @returns
 */
export async function getMatchInformations(matchId: string) {
    const db = await getSurrealClient()

    try {
        const matchInformations: SurrealResponse<any> = await db.query(`SELECT * FROM Match:${matchId};`)
        db.close();
        return matchInformations[0][0]   
    } catch(error) {
        console.error("Failed to get match informations:", error)
        throw new Error("Failed to get match informations")
    }
}

// TODO : Match exist ?
export async function doesMatchExist(matchId: string, matchData: Match) {
    const db = await getSurrealClient()
}

export async function testDatabaseConnexion() {
    const db = await getSurrealClient()

    try {
        const result = await db.query("INFO FOR DB;");
        db.close();
        return result
    } catch(error) {
        console.error("Failed to test database connexion:", error)
        throw new Error("Failed to test database connexion")
    }
}
