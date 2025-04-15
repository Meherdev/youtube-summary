import { motion } from 'framer-motion';
import { SummaryResponse } from '../types/summary';

interface Props {
  result: SummaryResponse | null;
}

export default function ResultCard({ result }: Props) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mt-8 p-6 bg-gray-800 rounded-xl shadow-xl"
    >
      <h2 className="text-xl font-bold mb-2">📄 Summary</h2>
      <p className="text-gray-200 mb-4">{result.summary}</p>

      <details className="mb-4">
        <summary className="cursor-pointer text-blue-400">View Transcript</summary>
        <p className="text-sm text-gray-400 whitespace-pre-wrap mt-2">{result.transcript}</p>
      </details>

      <div className="text-sm text-gray-400">
        <p>⏱ Duration: {result.duration_minutes} min</p>
        <p>📦 Size: {result.audio_size_mb} MB</p>
      </div>
    </motion.div>
  );
}
