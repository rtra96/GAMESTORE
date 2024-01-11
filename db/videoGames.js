const client = require('./client');
const util = require('util');

const REPLACE_ME = 'HELP REPLACE ME!!!!';

// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const { rows: videoGames } = await client.query(`SELECT * FROM videoGames`);
        return videoGames;
    } catch (error) {
        throw new Error("Make sure you have replaced the REPLACE_ME placeholder.")
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM videoGames
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame(body) {
    const { name, description, price, inStock, isPopular, imgUrl} = body;
    try {
        const {rows:[videoGame]} = await client.query(`
        INSERT INTO videogames(name, description, price, "inStock", "isPopular", "imgUrl") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`, [name, description, price, inStock, isPopular, imgUrl]);
        return videoGame;
    } catch (error) {
        console.error('Error creating video game:', error);
        throw new Error('Error creating video game');
    }
}
// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(id, fields = {}) {
    try {
        const setString = Object.keys(fields).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const {rows: [videoGame]} = await client.query(`UPDATE videoGames
        SET ${setString}
        WHERE id=${id} RETURNING *`, [Object.values(fields)]);
        console.log(result);
        return videoGame;

        // Prepare the values for the SQL query
        const values = Object.values(fields);

        // Update the video game in the database
        const { rows: [updatedVideoGame] } = await client.query(`
            UPDATE videoGames
            SET ${setString}
            WHERE id = $${values.length + 1}
            RETURNING *;
        `, [...values, id]);

        return updatedVideoGame;
    } catch (error) {
        console.error('Error updating video game:', error);
        throw new Error('Error updating video game');
    }
}

// DELETE - /api/video-games/:id - delete a single video game by id
async function deleteVideoGame(id) {
    try {
        const {rows: [videoGame]} = await client.query(`
        DELETE from videoGames WHERE id=$1 RETURNING *`, [id]);
        console.log(videoGame);
        return videoGame;
    } catch (error) {
        throw(error);
        
    }
}

module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}