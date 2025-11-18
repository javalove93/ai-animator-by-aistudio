
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be handled by the environment, but good practice to have a check.
  console.warn("API_KEY environment variable is not set. The app will not function without it.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateAnimeImage = async (
  drawingDataUrl: string,
  userPrompt: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const match = drawingDataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('유효하지 않은 이미지 데이터 URL입니다. 캔버스에 그림을 그려주세요.');
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
  
  const fullPrompt = `당신은 그림을 애니메이션 스타일로 바꾸는 AI 전문가입니다. 다음 라인 드로잉을 주어진 프롬프트에 맞춰 생생하고 아름다운 고품질 애니메이션 스타일의 이미지로 변환해 주세요. 원본 드로잉의 구도와 핵심 요소를 유지하면서 스타일을 적용해야 합니다.\n\n프롬프트: "${userPrompt}"`;
  
  const textPart = {
    text: fullPrompt,
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const resultMimeType = part.inlineData.mimeType;
        return `data:${resultMimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("생성된 이미지 데이터를 찾을 수 없습니다.");
  } catch (error) {
    console.error("Gemini API 호출 중 오류 발생:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`이미지 생성에 실패했습니다: ${error.message}`));
    }
    return Promise.reject(new Error("알 수 없는 오류로 이미지 생성에 실패했습니다. 다시 시도해 주세요."));
  }
};
