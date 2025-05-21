from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi import HTTPException

# 환경 변수 로드
load_dotenv()

# API 키 설정
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY가 없습니다. .env 파일을 확인하세요.")

genai.configure(api_key=GOOGLE_API_KEY)

# 요청 모델 정의
class ChatRequest(BaseModel):
    message: str
    chat_history: list = []

# 응답 모델 정의
class ChatResponse(BaseModel):
    response: str

# Gemini 모델 설정
model = genai.GenerativeModel('gemini-1.5-pro')

# 시스템 프롬프트
SYSTEM_PROMPT = """
당신은 헤어 스타일과 패션에 관한 전문적인 조언을 제공하는 AI 스타일 어시스턴트입니다.
사용자의 질문에 친절하고 전문적으로 답변해 주세요.
답변은 한국어로 제공하세요.
부적절한 질문이나 요청에는 정중하게 거절하세요.
"""

async def chat_with_gemini(request: ChatRequest):
    try:
        # 채팅 형식으로 메시지 구성
        chat = model.start_chat(history=[])
        
        # 시스템 프롬프트 추가
        messages = [
            {"role": "user", "parts": [SYSTEM_PROMPT]},
            {"role": "model", "parts": ["네, 저는 헤어 스타일과 패션에 관한 AI 스타일 어시스턴트입니다. 어떻게 도와드릴까요?"]}
        ]
        
        # 이전 대화 내용 추가 (선택적)
        if request.chat_history:
            for msg in request.chat_history:
                if msg["sender"] == "user":
                    messages.append({"role": "user", "parts": [msg["text"]]})
                else:
                    messages.append({"role": "model", "parts": [msg["text"]]})
        
        # 사용자 메시지 추가
        messages.append({"role": "user", "parts": [request.message]})
        
        # Gemini 모델에 메시지 전송
        chat = model.start_chat(history=messages[:-1])
        response = chat.send_message(request.message)
        
        return ChatResponse(response=response.text)
        
    except Exception as e:
        print(f"Gemini API 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gemini API 오류: {str(e)}")