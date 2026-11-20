import React, { useState } from 'react';
import { SAMPLE_LOGOS } from '../data/curriculumData';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

export default function LogoPickerModal({ isOpen, onClose, selectedLogo, onSelectLogo }) {
  const [customPreview, setCustomPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustom = () => {
    if (customPreview) {
      onSelectLogo(customPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg">Select School Logo / Crest</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Gallery */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Gallery Crests & Emblems
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_LOGOS.map((logo) => {
                const isSelected = selectedLogo === logo.url;
                return (
                  <button
                    key={logo.id}
                    type="button"
                    onClick={() => {
                      onSelectLogo(logo.url);
                      onClose();
                    }}
                    className={`group relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-100">
                      <img src={logo.url} alt={logo.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center line-clamp-1">
                      {logo.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">OR Upload From Device / Gallery</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Device file upload */}
          <div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition p-4">
              <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Choose picture from gallery or files</span>
              <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {customPreview && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={customPreview} alt="Uploaded logo preview" className="w-12 h-12 object-cover rounded-lg border" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Custom Logo Selected</p>
                    <p className="text-xs text-emerald-600 font-medium">Ready to apply</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow transition"
                >
                  Use This Logo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
