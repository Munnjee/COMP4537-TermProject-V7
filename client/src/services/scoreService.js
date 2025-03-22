import axios from 'axios';
import { API_URL } from '../config';

// create authenticated axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// save a game score
export const saveScore = async (accuracy) => {
    try {
        const response = await api.post('/scores', { accuracy });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

// get leaderboard data
export const getLeaderboard = async () => {
    try {
        const response = await api.get('/scores/leaderboard');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export default {
    saveScore,
    getLeaderboard
};

// Attribution: Claude 3.7 Sonnet and Copilot were used to assist in writing the code. 
