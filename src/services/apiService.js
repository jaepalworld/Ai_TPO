// src/services/apiService.js

/**
 * AI 헤어스타일 추천 시스템을 위한 API 서비스
 * ComfyUI와 FastAPI 백엔드와 통신하기 위한 함수들을 제공합니다.
 */

// API 기본 URL (실제 배포 환경에 맞게 수정)
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 이미지 파일을 Base64로 인코딩
 * @param {File} file - 이미지 파일
 * @returns {Promise<string>} Base64로 인코딩된 이미지 문자열
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // data:image/jpeg;base64, 부분을 제거하고 순수 base64 문자열만 반환
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * 데이터 URL에서 Blob 객체 생성
 * @param {string} dataUrl - 데이터 URL
 * @returns {Blob} Blob 객체
 */
const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

/**
 * 이미지 업로드 및 얼굴형 분석 요청
 * @param {File} imageFile - 업로드할 이미지 파일
 * @returns {Promise<Object>} 분석 결과 (얼굴형, 특징 등)
 */
export const analyzeFace = async (imageFile) => {
    try {
        const base64Image = await fileToBase64(imageFile);

        const response = await fetch(`${API_BASE_URL}/analyze-face`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image,
            }),
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('얼굴 분석 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 헤어스타일 시뮬레이션 요청
 * @param {Object} params - 시뮬레이션 파라미터
 * @param {string} params.image - Base64로 인코딩된 이미지
 * @param {string} params.faceShape - 얼굴형 (oval, round, square, heart, long)
 * @param {string} params.hairLength - 헤어 길이 (short, medium, long)
 * @param {string} params.occasion - 상황 (date, wedding, funeral, cafe, work, party)
 * @returns {Promise<Object>} 시뮬레이션 결과 (변환된 이미지, 추천 스타일 정보 등)
 */
export const simulateHairstyle = async (params) => {
    try {
        const { image, faceShape, hairLength, occasion } = params;

        let base64Image = image;
        if (image instanceof File) {
            base64Image = await fileToBase64(image);
        }

        const response = await fetch(`${API_BASE_URL}/simulate-hairstyle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image,
                face_shape: faceShape,
                hair_length: hairLength,
                occasion: occasion,
            }),
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const result = await response.json();

        // Base64 이미지를 Blob으로 변환하여 URL 생성
        if (result.result_image) {
            const imageBlob = dataURLtoBlob(`data:image/jpeg;base64,${result.result_image}`);
            result.image_url = URL.createObjectURL(imageBlob);
        }

        return result;
    } catch (error) {
        console.error('헤어스타일 시뮬레이션 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 저장된 TPO 프리셋 목록 가져오기
 * @returns {Promise<Array>} TPO 프리셋 목록
 */
export const getTPOPresets = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/tpo-presets`);

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('TPO 프리셋 목록 가져오기 오류:', error);
        throw error;
    }
};

/**
 * 추천 헤어스타일 저장
 * @param {Object} data - 저장할 데이터
 * @returns {Promise<Object>} 저장 결과
 */
export const saveRecommendation = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/save-recommendation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('추천 저장 중 오류 발생:', error);
        throw error;
    }
};

export default {
    analyzeFace,
    simulateHairstyle,
    getTPOPresets,
    saveRecommendation,
};