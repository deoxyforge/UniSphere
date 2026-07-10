import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Printer, Calendar, MapPin, Clock, Award } from 'lucide-react';

const QrPassModal = ({ isOpen, onClose, registration, student }) => {
  const qrRef = useRef(null);
  if (!isOpen || !registration) return null;

  const event = registration.event;

  // Format Date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to download the QR SVG as an image file
  const handleDownload = () => {
    const svgElement = document.getElementById('qr-svg-pass');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = `unisphere_pass_${registration._id}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md glass-panel bg-brand-card p-6 overflow-hidden border border-brand-border/60">
        
        {/* Glowing aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-brand-cardLight transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-violet-950/40 border border-violet-900/60 px-3 py-1 rounded-full text-[10px] text-violet-300 font-bold uppercase tracking-wider mb-2">
            <Award className="h-3.5 w-3.5" />
            Digital Entry Pass
          </div>
          <h2 className="text-xl font-extrabold text-white">Event Pass</h2>
        </div>

        {/* Card Content */}
        <div className="bg-brand-dark/50 border border-brand-border/40 rounded-xl p-5 mb-6 text-center flex flex-col items-center">
          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-xl shadow-2xl mb-4 border border-violet-200">
            <QRCodeSVG
              id="qr-svg-pass"
              value={registration.qrCode}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Pass ID: {registration._id}
          </p>

          <h3 className="text-base font-bold text-white mb-3 line-clamp-1">
            {event.title}
          </h3>

          <div className="w-full flex flex-col gap-2.5 text-xs text-slate-300 pt-3 border-t border-brand-border/20 text-left">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-400 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Student details */}
        <div className="px-4 py-3 bg-brand-cardLight/30 border border-brand-border/30 rounded-lg mb-6 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Attendee</p>
            <p className="text-sm font-bold text-white">{student?.name || 'Student'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Department</p>
            <p className="text-xs text-slate-300 font-medium">{student?.department || 'N/A'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleDownload} className="btn-secondary text-xs flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Download SVG
          </button>
          <button onClick={handlePrint} className="btn-primary text-xs flex items-center justify-center gap-2">
            <Printer className="h-4 w-4" />
            Print Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrPassModal;
