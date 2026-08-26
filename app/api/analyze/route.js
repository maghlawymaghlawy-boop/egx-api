import { GoogleGenerativeAI } from '@google/generative-ai';
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

    // إعداد المكتبة الرسمية
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // تحويل الملف إلى Base64
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');

    // إرسال الملف للتحليل
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type || 'application/pdf',
          data: base64Data,
        },
      },
      'قم بتحليل تقرير البورصة المصرية المرفق واستخراج أهم البيانات والملخص منها بشكل منظم.',
    ]);

    const responseText = result.response.text();

    return NextResponse.json({ success: true, result: responseText });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
