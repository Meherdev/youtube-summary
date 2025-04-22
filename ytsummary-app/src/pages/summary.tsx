import { useState } from 'react';
import UrlInput from '../components/UrlInput';
import ResultCard from '../components/ResultCard';
import Loader from '../components/Loader';
import { SummaryResponse } from '../types/summary';
import LanguageNotice from '../components/LanguageNotice';
import Navbar from '../components/Navbar';

function Summary () {
  const [result, setResult] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4 text-center text-white">🎬 YouTube Video Summarizer</h1>
      <UrlInput onResult={setResult} onLoading={setLoading} />
      <LanguageNotice />  {/* 👈 Place it here */}
      {loading && <Loader />}
      <ResultCard result={result} />
    </main>
    </>
  );
}

export default Summary;
