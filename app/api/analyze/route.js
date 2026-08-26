import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/genai';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم رفع أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `أنت خبير محترف في البورصة المصرية (EGX). قم بتحليل هذا التقرير اليومي واستخرج منه:
    1. ملخص حركة السوق وأهم المؤشرات (EGX30, EGX70).
    2. أسهم الشريعة التي أظهرت زخماً أو أحجام تداول ملحوظة.
    3. توقعات اتجاه السوق ورؤية سريعة للتداولات القادمة.
    اكتب الإجابة باللغة العربية وبشكل منظم وواضح.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: 'application/pdf',
        },
      },
    ]);

    const text = result.response.text();
    return NextResponse.json({ analysis: text });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الملف', details: error.message }, { status: 500 });
  }
}
