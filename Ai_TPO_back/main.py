#엔드포인트 모음
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# aichat 모듈에서 가져오기
from aichat import chat_with_gemini, ChatRequest, ChatResponse

app = FastAPI()

# CORS 설정 (React 앱과 통신하기 위해 필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    return await chat_with_gemini(request)

# 서버 상태 확인용 엔드포인트
@app.get("/")
def read_root():
    return {"status": "online", "message": "FastAPI 백엔드가 실행 중입니다."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)