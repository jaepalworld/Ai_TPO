import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const sendMessageToAI = async (message, chatHistory = []) => {
    try {
        const response = await axios.post(`${API_URL}/chat`, {
            message,
            chat_history: chatHistory
        });
        return response.data.response;
    } catch (error) {
        console.error('AI 응답 오류:', error);
        throw new Error('AI 응답을 가져오는 중 오류가 발생했습니다.');
    }
};