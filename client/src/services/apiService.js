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

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.