'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, AlertCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface QRScannerProps {
  onScanSuccess: (data: { restaurantId: string; tableId: string }) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    let isMounted = true;

    if (!startRequested) {
      setIsStarting(false);
      return () => {
        isMounted = false;
      };
    }

    const startScanning = async () => {
      setIsStarting(true);
      try {
        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        // Try to get available cameras first
        let cameraId: string | { facingMode: string } | null = null;
        try {
          const cameras = await Html5Qrcode.getCameras();
          console.log('Available cameras:', cameras);
          
          // Use back camera if available, otherwise use first available camera
          cameraId = cameras.find(cam => cam.label.toLowerCase().includes('back') || cam.label.toLowerCase().includes('rear'))?.id || cameras[0]?.id || null;
        } catch (camError) {
          console.warn('Could not enumerate cameras, using facingMode:', camError);
          // Fall back to facingMode if camera enumeration fails
          cameraId = { facingMode: 'environment' };
        }

        // Safari iOS prefers facingMode over camera ID
        const deviceId = cameraId || { facingMode: 'environment' };

        await html5QrCode.start(
          deviceId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              // Make QR box responsive and smaller for mobile
              const minEdgePercentage = 0.7;
              const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
              return {
                width: qrboxSize,
                height: qrboxSize
              };
            },
            aspectRatio: 1.0,
            disableFlip: false, // Allow camera flip for front/back
          },
          async (decodedText) => {
            // Parse QR code data
            // Expected format: /menu?restaurantId=rest_001&tableId=Table-5
            // or JSON: {"restaurantId":"rest_001","tableId":"Table-5"}
            try {
              let restaurantId = '';
              let tableId = '';

              // Try parsing as URL
              if (decodedText.includes('restaurantId') && decodedText.includes('tableId')) {
                const url = new URL(decodedText.startsWith('http') ? decodedText : `http://dummy.com${decodedText}`);
                restaurantId = url.searchParams.get('restaurantId') || '';
                tableId = url.searchParams.get('tableId') || '';
              } else {
                // Try parsing as JSON
                const parsed = JSON.parse(decodedText);
                restaurantId = parsed.restaurantId || '';
                tableId = parsed.tableId || '';
              }

              if (restaurantId && tableId && isMounted && isScanningRef.current) {
                try {
                  await html5QrCode.stop();
                  isScanningRef.current = false;
                } catch (stopError) {
                  // Ignore stop errors - scanner might already be stopped
                  isScanningRef.current = false;
                }
                if (isMounted) {
                  onScanSuccess({ restaurantId, tableId });
                }
              } else if (isMounted) {
                setError(t('qrScanner.invalidQR') || 'Invalid QR code format');
              }
            } catch (parseError) {
              if (isMounted) {
                setError(t('qrScanner.invalidQR') || 'Invalid QR code format');
              }
            }
          },
          () => {
            // Error callback - ignore scanning errors
          }
        );
        if (isMounted) {
          setIsScanning(true);
          isScanningRef.current = true;
        }
      } catch (err: any) {
        if (isMounted) {
          let errorMessage = t('qrScanner.cameraError') || 'Failed to access camera';
          const isHttp = typeof window !== 'undefined' && window.location.protocol === 'http:';
          const isNotLocalhost = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
          
          console.error('QR Scanner error details:', {
            name: err?.name,
            message: err?.message,
            stack: err?.stack,
            error: err
          });
          
          // Provide more specific error messages
          if (err?.name === 'NotAllowedError' || err?.message?.includes('permission') || err?.message?.includes('Permission')) {
            errorMessage = t('qrScanner.permissionDenied') || 'Camera permission denied. Please allow camera access in your browser settings.';
          } else if (err?.name === 'AbortError' || err?.message?.includes('aborted')) {
            // Safari often throws AbortError when the permission sheet is dismissed or the stream is interrupted
            errorMessage = t('qrScanner.aborted') || 'Camera access was interrupted. Please retry and allow camera access.';
          } else if (err?.name === 'NotFoundError' || err?.message?.includes('camera') || err?.message?.includes('No camera') || err?.message?.includes('device not found')) {
            errorMessage = t('qrScanner.noCamera') || 'No camera found. Please ensure your device has a camera.';
          } else if (err?.name === 'NotReadableError' || err?.message?.includes('could not start video source') || err?.message?.includes('Could not start video source')) {
            errorMessage = t('qrScanner.cameraInUse') || 'Camera is in use by another app. Please close other apps using the camera and try again.';
          } else if (err?.message?.includes('HTTPS') || err?.message?.includes('secure') || (isHttp && isNotLocalhost)) {
            errorMessage = t('qrScanner.httpsRequired') || 'Camera access requires HTTPS. Safari on iOS requires a secure connection for camera access.';
          } else if (err?.message) {
            // Show the actual error message if available
            errorMessage = err.message;
          }
          
          setError(errorMessage);
        }
      }
      setIsStarting(false);
    };

    startScanning();

    return () => {
      isMounted = false;
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear().catch(() => {}))
          .catch(() => {
            // Ignore errors when cleaning up
          });
        isScanningRef.current = false;
      }
    };
  }, [onScanSuccess, t, startRequested]);

  const handleClose = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        isScanningRef.current = false;
      } catch (err) {
        // Ignore errors - scanner might already be stopped
        isScanningRef.current = false;
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary font-heading">
            {t('qrScanner.scanQR') || 'Scan QR Code'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner */}
        <div className="p-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <p className="text-text-muted text-center mb-4 text-sm">{error}</p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={async () => {
                    setError(null);
                    // Clean up any running scanner before retrying
                    if (scannerRef.current && isScanningRef.current) {
                      try {
                        await scannerRef.current.stop();
                        await scannerRef.current.clear();
                      } catch (e) {
                        // Ignore
                      } finally {
                        isScanningRef.current = false;
                      }
                    }
                    // User-initiated retry
                    setStartRequested(false);
                    setTimeout(() => setStartRequested(true), 50);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t('qrScanner.retry') || 'Retry'}
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors"
                >
                  {t('common.close')}
                </button>
              </div>
              {(error.includes('HTTPS') || error.includes('secure') || window.location.protocol === 'http:') && window.location.hostname !== 'localhost' ? (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 max-w-sm">
                  <p className="font-semibold mb-1">📱 Mobile Camera Access:</p>
                  <p className="mb-2">Mobile browsers require HTTPS for camera access.</p>
                  <p className="text-xs">Options:</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>Use <code className="bg-yellow-100 px-1 rounded">localhost</code> on your phone</li>
                    <li>Set up HTTPS tunnel (ngrok, Cloudflare Tunnel)</li>
                    <li>Use your laptop's IP with HTTPS</li>
                  </ul>
                </div>
              ) : null}
            </div>
          ) : !startRequested ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 gap-4">
              <p className="text-sm text-text-muted text-center">
                {t('qrScanner.instructions') ||
                  'Point your camera at the QR code on your table'}
              </p>
              <button
                onClick={() => setStartRequested(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                {t('scanPage.startScanning') || 'Start Scanning'}
              </button>
            </div>
          ) : (
            <div className="relative">
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
              {(!isScanning || isStarting) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-sm text-text-muted text-center px-6 py-4">
                    {isStarting
                      ? t('qrScanner.cameraStarting') || 'Starting camera...'
                      : t('qrScanner.align') || 'Align the QR code in the frame'}
                  </div>
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-primary rounded-lg w-64 h-64" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gray-50 border-t border-border">
          <p className="text-sm text-text-muted text-center">
            {t('qrScanner.instructions') || 'Point your camera at the QR code on your table'}
          </p>
        </div>
      </div>
    </div>
  );
}

