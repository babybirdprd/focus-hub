import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { saveApiKeys } from '../services/tauriApi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [githubKey, setGithubKey] = useState('');
  const [julesKey, setJulesKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await saveApiKeys(githubKey, julesKey);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.toString() || "Failed to save keys");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-4">Setup API Keys</h2>
        <p className="text-slate-400 mb-6 text-sm">
          To use Focus Hub, please provide your GitHub Personal Access Token and Jules API Key.
          These are stored securely on your device.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Token</label>
            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="ghp_..."
              value={githubKey}
              onChange={(e) => setGithubKey(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Jules API Key</label>
            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="jules_..."
              value={julesKey}
              onChange={(e) => setJulesKey(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-400/10 p-2 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!githubKey || !julesKey || isSaving}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Keys'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
