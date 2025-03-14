import axios from 'axios';
import { API_URL } from '../config';

export const generateQuestions = async (topic, count) => {
  try {
    const response = await axios.post(
      `${API_URL}/trivia/generate`,
      {
        topic,
        count,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
