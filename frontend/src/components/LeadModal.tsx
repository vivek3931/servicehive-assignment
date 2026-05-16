import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface LeadFormData {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  initialData?: LeadFormData | null;
  title: string;
}

export default function LeadModal({ isOpen, onClose, onSubmit, initialData, title }: LeadModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    status: 'New',
    source: 'Website',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-surface-black/40 dark:bg-surface-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-[24px] my-8 overflow-hidden text-left align-middle transition-all transform apple-card border-none">
          <div className="flex items-center justify-between mb-[24px]">
            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-ink dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-ink-muted-48 hover:text-ink dark:text-body-muted-dark dark:hover:text-white apple-active"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-80 dark:text-body-muted-dark mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`apple-input-box w-full ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1 text-[12px] text-red-500 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-80 dark:text-body-muted-dark mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`apple-input-box w-full ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-[12px] text-red-500 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-80 dark:text-body-muted-dark mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="apple-input-box w-full"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-semibold tracking-[-0.224px] text-ink-muted-80 dark:text-body-muted-dark mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                className="apple-input-box w-full"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="apple-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="apple-btn-primary"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}