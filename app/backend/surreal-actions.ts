import Surreal, { StringRecordId } from "surrealdb"
import { User } from "@/types/User"
import { SurrealResponse } from "@/types/surreal-response"
import { Round } from "@/types/round"
import { Match } from "@/types/match"

const settings: ConnectionSettings = {
    url: process.env.SURREALDB_URL || "",
    namespace: process.env.SURREALDB_NAMESPACE || "",
    database: process.env.SURREALDB_DATABASE || "",
    username: process.env.SURREALDB_USERNAME || "",
    password: process.env.SURREALDB_PASSWORD || "",
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
 * Recuperer les informations d'un User
 * @param userId 
 * @returns 
 */
export async function getUserInformations(userId: string) {
    const db = await getSurrealClient()

    try {
        const userInformations: SurrealResponse<any> = await db.query(`SELECT * FROM RecordedUser:${userId};`)
        db.close();
        return userInformations[0][0]
    } catch(error) {
        console.error("Failed to get user informations:", error)
        throw new Error("Failed to get user informations")
    } 
}

/**
 * Recuperer les informations d'un User
 * @param userId 
 * @returns 
 */
export async function getUserMatchHistory(userId: string) {
    const db = await getSurrealClient()

    try {
        const matchHistoryInformations: SurrealResponse<any> = await db.query(`SELECT *, created_at FROM ${userId}->recordeduser_recorded_match->Match ORDER BY created_at DESC FETCH Match;`)
        db.close();
        return matchHistoryInformations[0]
    } catch(error) {
        console.error("Failed to get user Match History:", error)
        throw new Error("Failed to get user Match History")
    } 
}

/**
 * Creer un joueur dans la base de données
 * @param userData 
 * @returns 
 */
export async function createUser(userData: User) {
    const db = await getSurrealClient()

    try {
        const userCreation: SurrealResponse<any> = await db.query(`CREATE ONLY User CONTENT $item`, {item: userData})
        db.close();
        return userCreation[0]
    } catch(error) {
        console.error("Failed to create user ", error)
        throw new Error("Failed to get user")
    } 
}

/**
 * Créer un match dans la base de données
 * @param matchData - Les données du match à créer
 * @returns Les données du match créé
 * @throws {Error} Si la création du match échoue
 */
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


export async function relateRecordedUserToMatch(userId: string, matchId: string) {
    const db = await getSurrealClient()

    try {        
        const matchCreation: SurrealResponse<any> = await db.query(`RELATE ${userId}->recordeduser_recorded_match->${matchId}`)

        db.close();
        return matchCreation[0]
    } catch(error) {
        console.error("Failed to create Match:", error)
        throw new Error("Failed to create Match")
    }
}

/**
 * TODO : REMOVE
 * Génère liste de Records id pour les joueurs afin de créer les relations
 * @param {string[]} playerList - Array of player identifiers
 * @returns
 */
export async function generatePlayerListRecordId(playerList: string[]) {

    const playerListField: StringRecordId[] = []

    
    playerList.map((player: string, index: number) => {
        if(player.match(/^Player:[a-zA-Z0-9]+$/)) {
            playerListField[index] = new StringRecordId(player);
        }
    })

    return playerListField
}

/**
 * Relie une liste de joueurs à un round existant
 * @param playerList - Array of player identifiers
 * @param roundRecord - Round Record Id
 * @returns
 */
export async function relatePlayerToRound(playerList: string[],roundRecord: string) {
    const db = await getSurrealClient()

    const relationData: any = {
        deck: []
    }

    try {
        playerList.map(async (playerRecord: string) => {
            if(playerRecord.match(/^Player:[a-zA-Z0-9]+$/)) {
                await db.query(`RELATE ${playerRecord}->plays_in_round->${roundRecord} CONTENT $item`, {item: relationData})
            }
        })
    } catch(error) {
        console.error("Failed to relate player to match:", error)
        throw new Error("Failed to relate player to match")
    }

}

/**
 * Crée un nouveau round dans la base de données et le relie à un match existant
 * @param matchId - L'identifiant du match auquel le round sera relié
 * @param roundData - Les données du round à créer
 * @returns Les données du round créé
 * @throws {Error} Si la création du round ou la relation échoue
 */
export async function createRound(roundData: Round, players: string[]) {
    const db = await getSurrealClient()

    try {

        const finalRoundData: Round = {
            ...roundData,
        }
        players.map((player: string) => {
            Object.assign(finalRoundData, { [player]: [] })
        })

        const roundCreationData: SurrealResponse<any> = await db.query(`CREATE ONLY Round CONTENT $item`, {item: finalRoundData})
        
        db.close();
        return roundCreationData[0]
    } catch(error) {
        console.error("Failed to create Round:", error)
        throw new Error("Failed to create Round")
    } 
}

/**
 * Supprime le round
 * @param roundId - L'identifiant record du round
 * @returns Message de confirmation
 * @throws {Error} Si la suppresion du round échoue
 */
export async function deleteRound(roundId: string) {
    const db = await getSurrealClient()

    try {
        await db.query(`DELETE ${roundId}`)
        
        db.close();
        return Response.json({ message: "Round supprimé" })
    } catch(error) {
        console.error("Failed to delete Round:", error)
        throw new Error("Failed to delete Round")
    } 
}

/**
 * Relie un round à un match existant
 * @param roundId - L'identifiant du round à relier
 * @param matchId - L'identifiant du match auquel le round sera relié
 * @returns Les données de la relation créée
 * @throws {Error} Si la relation échoue
 */
export async function relateRoundToMatch(roundId: string, matchId: string) {
    const db = await getSurrealClient()

    try {
        const relationCreation: SurrealResponse<any> = await db.query(`RELATE ${matchId}->match_has_round->${roundId}`)
        db.close();
        return relationCreation[0]
    } catch(error) {
        console.error("Failed to create Round:", error)
        throw new Error("Failed to create Round")
    }
}

/**
 * Modifier les informations d'un round
 * @param roundId - L'identifiant record du round
 * @returns Message de confirmation
 * @throws {Error} Si la suppresion du round échoue
 */
export async function updateRoundInformations(roundId: string, updateInformations: string) {
    const db = await getSurrealClient()

    try {
        let roundUpdateInformations: SurrealResponse<any> = 
        await db.query(`UPDATE ${roundId} MERGE $content`, {content: updateInformations});

        db.close();
        return roundUpdateInformations[0][0] 
    } catch(error) {
        console.error("Failed to delete Round:", error)
        throw new Error("Failed to delete Round")
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

/**
 * Recuperer les informations d'un round
 * @param roundId
 * @returns
 */
export async function getRoundInformations(roundId: string) {
    const db = await getSurrealClient()

    try {
        const roundInformations: SurrealResponse<any> = await db.query(`SELECT * FROM ${roundId};`)
        db.close();
        
        return roundInformations[0]
    } catch(error) {
        console.error("Failed to get round informations:", error)
        throw new Error("Failed to get round informations")
    }
}

/**
 * Suppresion d'un match et ses round liés
 * @param matchId
 * @returns
 */
export async function deleteMatch(matchId: string) {
    const db = await getSurrealClient()

    try {   
        const deletionInformations: SurrealResponse<any> = await db.query(`DELETE (SELECT VALUE <set><->match_has_round<->Round FROM ONLY ${matchId});`)
        await db.query(`DELETE ${matchId}`)
        db.close();
        return deletionInformations[0][0]   
    } catch(error) {
        console.error("Failed to delete match", error)
        throw new Error("Failed to delete match")
    }
}

/**
 * Recuperer la liste des rounds d'un match
 * @param matchId
 * @returns
 * 
 */
export async function getMatchRounds(matchId: string) {
    const db = await getSurrealClient()
    try {
        const roundList: SurrealResponse<any> = await db.query(`SELECT *, round_index FROM ${matchId}->match_has_round->Round ORDER BY round_index ASC FETCH Round;`)
        db.close()
        return roundList[0]
    } catch(error) {
        console.error("Failed to get match rounds:", error)
        throw new Error("Failed to get match rounds")
    }
}

/**
 * Recuperer la liste des decks d'un round
 * @param roundId
 * @returns
 */
export async function getRoundDeckList(roundId: string) {
    const db = await getSurrealClient()
    try {
        const onlinePlayerData: SurrealResponse<any> = await db.query(`SELECT in as player, deck FROM Round:${roundId}<-plays_in_round;`)
        const localPlayerData: SurrealResponse<any> = await db.query(`SELECT * FROM Round:${roundId}->belongs_to_match;`)
        db.close()

        let deckList: { [key: string]: any } = {} 

        // Formatage pour les joueurs locaux
        if(localPlayerData[0][0].local_player.length > 0) {        
            localPlayerData[0][0].local_player.map((localPlayer: any) => {
                deckList[localPlayer] = localPlayerData[0][0][`deck_${localPlayer}`]
            })
        }

        // Formatage pour les joueurs en ligne
        if(onlinePlayerData[0].length > 0) {
            onlinePlayerData[0].map((onlinePlayer: any) => {
                deckList[onlinePlayer.player] = onlinePlayer.deck
            }) 
        }

        return deckList

    } catch(error) {
        console.error("Failed to get round deck list:", error)
        throw new Error("Failed to get round deck list")
    }
}

/**
 * Modifie le deck d'un joueur local
 * @param playerName
 * @param cardId
 * @returns
 */
export async function updateLocalPlayerDeckInRound(playerName: string, roundId: string, matchId: string) {
    const db = await getSurrealClient()

    try {
        const result = await db.query(`UPDATE Player:${playerName} SET deck = $deck`, {deck: []})
        db.close();
        return result 
    } catch(error) {
        console.error("Failed to update local player deck:", error)
        throw new Error("Failed to update local player deck")
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
