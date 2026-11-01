import React, { useState } from 'react';
import { X, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({ isOpen, onClose }) => {
  const { selectedPincode, setSelectedPincode } = useAuth();
  const [pincodeInput, setPincodeInput] = useState(selectedPincode);
  const [status, setStatus] = useState<{ checked: boolean; deliverable?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      setStatus({ checked: true, deliverable: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/products/pincode/${pincodeInput}`);
      if (res.data.success) {
        setStatus({ checked: true, deliverable: true, message: res.data.message });
        setSelectedPincode(pincodeInput);
      } else {
        setStatus({ checked: true, deliverable: false, message: res.data.message });
      }
    } catch {
      setStatus({ checked: true, deliverable: false, message: 'Could not verify delivery for this PIN code' });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (status?.deliverable) {
      setSelectedPincode(pincodeInput);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Select Delivery Location</h3>
            <p className="text-xs text-gray-500">Check product availability & fast delivery times</p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="relative flex items-center">
            <input
              type="text"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) => {
                setPincodeInput(e.target.value.replace(/\D/g, ''));
                setStatus(null);
              }}
              placeholder="Enter 6-digit PIN code (e.g. 560034)"
              className="w-full px-3 py-2.5 border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] text-sm outline-none font-medium tracking-wide"
            />
            <button
              type="submit"
              disabled={loading || pincodeInput.length !== 6}
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#2874f0] text-white text-xs font-semibold rounded hover:bg-[#1259c3] disabled:opacity-50 transition"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>

          {status && status.checked && (
            <div className={`p-3 rounded-md text-xs flex items-center gap-2 ${
              status.deliverable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {status.deliverable ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Popular cities:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setPincodeInput('560034'); }}
                className="text-[#2874f0] hover:underline"
              >
                Bengaluru
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setPincodeInput('110001'); }}
                className="text-[#2874f0] hover:underline"
              >
                Delhi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setPincodeInput('400001'); }}
                className="text-[#2874f0] hover:underline"
              >
                Mumbai
              </button>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!status?.deliverable}
              className="px-4 py-2 text-xs font-semibold bg-[#2874f0] text-white hover:bg-[#1259c3] rounded shadow disabled:opacity-50"
            >
              Set Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

