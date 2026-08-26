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
      return NextResponse.json({ error: 'مفتاح GEMINI_API_KEY غير معرف في بيئة العمل' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString('base64');

    // استخدام الرقم الدقيق والمعتمد للنموذج المستقر
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: file.type || 'application/pdf',
                    data: base64Data,
                  },
                },
                {
                  text: 'قم بتحليل تقرير البورصة المصرية المرفق واستخراج أهم البيانات والملخص منها بشكل منظم.',
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'فشل الاتصال بـ Gemini API' }, { status: response.status });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتم استخراج نص';

    return NextResponse.json({ success: true, result: resultText });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
