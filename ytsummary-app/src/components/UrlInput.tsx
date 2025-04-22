import { useState } from 'react';
import { getOrCreateDeviceId } from '../utils';
import api from '../Api';

interface Props {
  onResult: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function UrlInput({ onResult, onLoading }: Props) {
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onLoading(true);
    try {
      const deviceId = getOrCreateDeviceId();
      const res = await api.post('/summarize', new URLSearchParams({ youtube_url: url}));
      onResult(res.data);
      setErrorMsg("");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Something went wrong";
      setErrorMsg(msg);
      onResult(null);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto p-4">
      <input
        type="text"
        placeholder="Paste YouTube link..."
        className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {errorMsg && (
        <div className="mt-3 text-red-400 text-center font-medium">
          ⚠️ {errorMsg}
        </div>
      )}
      <button
        type="submit"
        className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 transition-all py-2 rounded-md text-white font-semibold"
      >
        Summarize
      </button>
    </form>
  );
}
