// server2/src/analyze/analyze.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

interface SentimentAnalysisRequest {
  answer: string;
}

@Controller('analyze')
export class AnalyzeController {
  @Post()
  async analyzeSentimentAndGenerateResponse(
    @Body() data: SentimentAnalysisRequest,
  ): Promise<any> {
    try {
      const clientAnswer = data.answer;

      // 1. 네이버 Clova Sentiment API 호출
      const clovaResponse = await axios.post(
        'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze',
        {
          content: clientAnswer,
        },
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'YOUR_CLOVA_API_KEY_ID',
            'X-NCP-APIGW-API-KEY': 'YOUR_CLOVA_API_KEY',
            'Content-Type': 'application/json',
          },
        },
      );

      // 감정 분석 결과 추출 (API 응답 형식에 따라 수정 필요)
      const emotion = clovaResponse.data.document.sentiment;

      // 2. ChatGPT API 호출 (분석된 감정과 답변 포함)
      const chatGptResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `감정: ${emotion}, 답변: ${clientAnswer}`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
          },
        },
      );

      // ChatGPT API 응답 추출 (API 응답 형식에 따라 수정 필요)
      const chatGptAnswer = chatGptResponse.data.choices[0].message.content;

      // 3. 최종 응답 생성 및 서버_1로 전송
      return { answer: chatGptAnswer };
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to analyze sentiment and generate response');
    }
  }
}