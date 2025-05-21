// API 호출 함수
export const sendMessageToAI = async (message, chatHistory = []) => {
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                chat_history: chatHistory
            }),
        });

        if (!response.ok) {
            throw new Error(`API 응답 오류: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('AI 메시지 전송 오류:', error);
        throw error;
    }
};