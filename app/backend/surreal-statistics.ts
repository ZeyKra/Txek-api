import { SurrealResponse } from "../types/surreal-response";
import { getSurrealClient } from "./surreal-actions";

const DefaultStatisticsData = {
    round_played: 0,
    match_played: 0,
    win: 0,
    loss: 0
};

export async function createStatisticsProfile() {
    const db = await getSurrealClient();

    try {
        let response: SurrealResponse<any> = await db.query(`INSERT INTO PlayerStatistics ${JSON.stringify(DefaultStatisticsData)}`)
        db.close();
        return response[0][0];
    } catch (error) {
        db.close();
        console.error("Failed to create player statistics", error);
        throw new Error('Failed to create player statistics');
    }   
};

export async function createStatisticsRelation(playerId: string, statisticsProfileId: string) {
    const db = await getSurrealClient();

    try {
        let response: SurrealResponse<any> = await db.query(`RELATE ${playerId}->player_has_statistics->${statisticsProfileId}`)
        db.close();
        return response[0][0];
    } catch (error) {
        db.close();
        console.error("Failed to create player statistics relation", error);
        throw new Error('Failed to create player statistics relation');
    }
}