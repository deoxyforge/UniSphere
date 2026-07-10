import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Keyboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { attendanceAPI } from '../services/api';
import confetti from 'canvas-confetti';

const QrScannerModal = ({ isOpen, onClose, event, onAttendanceMarked }) => {
  if (!isOpen || !event) return null;

  const [mode, setMode] = useState('camera'); // 'camera' or 'manual'
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const scannerId = 'qr-reader';

  useEffect(() => {
    let html5QrCode;
    
    if (isOpen && mode === 'camera' && cameraActive) {
      setError('');
      setSuccess('');
      
      html5QrCode = new Html5Qrcode(scannerId);
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Success callback
          console.log(`Scan result: ${decodedText}`);
          // Stop camera before processing
          try {
            await html5QrCode.stop();
            setCameraActive(false);
          } catch (e) {
            console.error(e);
          }
          handleMarkAttendance(decodedText);
        },
        (errorMessage) => {
          // Silent catch to prevent console flood
        }
      ).catch((err) => {
        console.error("Camera startup failed:", err);
        setError("Could not access camera. Please check permissions or use Manual Entry mode.");
        setCameraActive(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          console.log("Scanner stopped.");
        }).catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, [isOpen, mode, cameraActive]);

  const handleMarkAttendance = async (qrDataText) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await attendanceAPI.mark({
        qrData: qrDataText,
        eventId: event._id
      });
      
      setSuccess(res.data.message || 'Attendance marked successfully!');
      
      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#10b981', '#3b82f6']
      });

      if (onAttendanceMarked) {
        onAttendanceMarked();
      }

      setManualCode('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Verification failed. Student might not be registered or attendance already marked.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleMarkAttendance(manualCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md glass-panel bg-brand-card p-6 overflow-hidden border border-brand-border/60">
        
        {/* Glowing borders */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl"></div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-brand-cardLight transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white mb-1">Check-in Attendee</h2>
          <p className="text-xs text-slate-400 truncate">Event: {event.title}</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-brand-dark rounded-lg border border-brand-border/30 mb-6">
          <button
            onClick={() => { setMode('camera'); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'camera' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="h-4 w-4" />
            QR Camera
          </button>
          <button
            onClick={() => { setMode('manual'); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'manual' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="h-4 w-4" />
            Manual Entry (Test)
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Camera Scanner View */}
        {mode === 'camera' && (
          <div className="flex flex-col items-center">
            {cameraActive ? (
              <div className="w-full relative rounded-xl overflow-hidden aspect-square max-w-[280px] bg-black border-2 border-violet-500/40 shadow-2xl">
                <div id={scannerId} className="w-full h-full"></div>
                {/* Laser scan effect */}
                <div className="absolute inset-x-0 h-0.5 bg-violet-400 top-0 shadow-lg shadow-violet-400 animate-pulse-slow" style={{ animation: 'float 2s ease-in-out infinite' }}></div>
              </div>
            ) : (
              <div className="w-full max-w-[280px] aspect-square bg-brand-dark/50 border border-dashed border-brand-border rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <Camera className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-xs text-slate-400 mb-4">Click below to activate camera scanner</p>
                <button
                  onClick={() => setCameraActive(true)}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Start Scanning
                </button>
              </div>
            )}

            {cameraActive && (
              <button
                onClick={() => setCameraActive(false)}
                className="btn-secondary text-xs mt-4 py-1.5 px-3"
              >
                Stop Camera
              </button>
            )}
          </div>
        )}

        {/* Manual Simulator View */}
        {mode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Registration ID / QR Payload
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. reg00001 or paste QR string"
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            
            <p className="text-[10px] text-slate-500 leading-relaxed bg-brand-dark/20 p-2.5 rounded border border-brand-border/20">
              💡 <b>Tip for Testing:</b> Open the Student Dashboard in another tab and copy the Pass ID (e.g. <code>reg00001</code>) and paste it here to test verification!
            </p>

            <button
              type="submit"
              disabled={loading || !manualCode.trim()}
              className="btn-primary w-full text-xs py-2.5"
            >
              {loading ? 'Verifying...' : 'Mark Present'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QrScannerModal;
