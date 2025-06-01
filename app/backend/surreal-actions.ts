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
        const userInformations: SurrealResponse<any> = await db.query(`SELECT * FROM User:${userId};`)
        db.close();
        return userInformations[0][0]
    } catch(error) {
        console.error("Failed to get user informations:", error)
        throw new Error("Failed to get user informations")
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

/**
 * Relie un round à un match existant
 * @param roundId - L'identifiant du round à relier
 * @param matchId - L'identifiant du match auquel le round sera relié
 * @returns Les données de la relation créée
 * @throws {Error} Si la relation échoue
 */
export async function relateUserToRound(roundId: string, matchId: string) {
    const db = await getSurrealClient()

    try {
        const roundRelationContent = await generateRoundRelationContent(matchId)
        const relationCreation: SurrealResponse<any> = await db.query(`RELATE ${roundId}->belongs_to_match->Match:${matchId} CONTENT $item`, {item: roundRelationContent})
        db.close();
        return relationCreation[0]
    } catch(error) {
        console.error("Failed to create Round:", error)
        throw new Error("Failed to create Round")
    }
}

/**
 * Génère le contenu de la relation entre un round et un match
 * @param matchId - L'identifiant du match auquel le round sera relié
 * @returns Le contenu de la relation
 * @throws {Error} Si la génération du contenu de la relation échoue
 */
export async function generateRoundRelationContent(matchId: string) {
    const db = await getSurrealClient();

    try {
        const matchInformations = await getMatchInformations(matchId);

        //console.log("matchInformations:", matchInformations); // DEBUG
        
        const roundRelationContent: any = {
            local_player: matchInformations.local_player
        }
        
        if(matchInformations.local_player.length > 0) {
            matchInformations.local_player.map((localPlayer : string) => {
                roundRelationContent[`deck_${localPlayer}`] = []
            })
        }

        //console.log("roundRelationContent:", roundRelationContent); // DEBUG
        
        db.close();
        return roundRelationContent 
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

/**
 * Recuperer les informations d'un round
 * @param roundId
 * @returns
 */
export async function getRoundInformations(roundId: string) {
    const db = await getSurrealClient()

    try {
        const roundInformations: SurrealResponse<any> = await db.query(`SELECT * FROM Round:${roundId};`)
        db.close();
        
        return roundInformations[0][0] 
    } catch(error) {
        console.error("Failed to get round informations:", error)
        throw new Error("Failed to get round informations")
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
        const roundList: SurrealResponse<any> = await db.query(`SELECT *, round_index FROM Match:${matchId}<-belongs_to_match<-Round ORDER BY round_index ASC FETCH Round;`)
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

/**
 * Modifie le deck d'un joueur en ligne (a la relation)
 * @param playerId
 * @param cardId
 * @returns
 */ 
export async function updateOnlinePlayerDeckInRound(playerId: string, roundId: string) {
    const db = await getSurrealClient()

    try {
        const result = await db.query(`UPDATE Player:${playerId} SET deck = $deck`, {deck: []})
        db.close();
        return result 
    } catch(error) {
        console.error("Failed to update player deck:", error)
        throw new Error("Failed to update player deck")
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
