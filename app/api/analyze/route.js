import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرفاق أي ملف' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح GEMINI_API_KEY غير معرف في Vercel' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: file.type || 'application/pdf',
            data: base64Data,
          },
        },
        'قم بتحليل تقرير البورصة المصرية المرفق واستخرج أهم البيانات والملخص منها بشكل منظم.',
      ],
    });

    return NextResponse.json({ success: true, result: response.text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
