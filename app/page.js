'use client';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('حدث خطأ أثناء معالجة الملف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 dir-rtl text-right">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-emerald-400 text-center">
          محلل البورصة المصرية بالذكاء الاصطناعي 📈
        </h1>

        <div className="border-2 border-dashed border-slate-700 p-8 text-center rounded-xl bg-slate-800">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold inline-block"
          >
            {loading ? 'جاري التحليل واستخراج البيانات...' : 'رفع تقرير البورصة اليومي (PDF)'}
          </label>
        </div>

        {result && (
          <div className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700">
            <h2 className="text-xl font-bold text-emerald-400">نتائج التوقعات والتحليل:</h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-900 p-4 rounded-lg">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
       
