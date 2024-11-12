"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ErrorMessage } from './ErrorMessage';
import { ReadyState } from './ReadyState';
import { ScanResult } from './ScanResult';
import { ScannerControls } from './ScannerControls';

export function QRScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error('Error cleaning up scanner:', error);
        }
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);
    setScanResult(null);

    // Clean up existing scanner instance if it exists
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.error('Error cleaning up previous scanner:', error);
      }
    }

    try {
      // Request camera permission explicitly
      await navigator.mediaDevices.getUserMedia({ video: true });

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          showTorchButtonIfSupported: true,
          videoConstraints: {
            facingMode: { ideal: "environment" }
          }
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
          }
        },
        (errorMessage) => {
          console.error(errorMessage);
          if (!scanResult) {
            setError("Failed to access camera. Please ensure you've granted camera permissions.");
          }
        }
      );
    } catch (err) {
      console.error('Camera access error:', err);
      setError("Camera access denied. Please enable camera permissions and try again.");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        setIsScanning(false);
        setError(null);
      } catch (error) {
        console.error('Error stopping scanner:', error);
        setError("Failed to stop scanner. Please refresh the page and try again.");
      }
    }
  };

  const copyToClipboard = async () => {
    if (scanResult) {
      try {
        await navigator.clipboard.writeText(scanResult);
        toast({
          title: "Copied to clipboard",
          description: "The QR code content has been copied to your clipboard.",
        });
      } catch (err) {
        console.error('Clipboard error:', err);
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy the content to clipboard.",
        });
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} />}

        {!isScanning && !scanResult && (
          <ReadyState onStartScan={startScanning} />
        )}

        {isScanning && (
          <div className="space-y-4">
            <div id="qr-reader" className="mx-auto" />
            <ScannerControls
              isScanning={isScanning}
              scanResult={scanResult}
              onStartScan={startScanning}
              onStopScan={stopScanning}
              onCopy={copyToClipboard}
            />
          </div>
        )}

        {scanResult && (
          <div className="space-y-4">
            <ScanResult result={scanResult} />
            <ScannerControls
              isScanning={isScanning}
              scanResult={scanResult}
              onStartScan={startScanning}
              onStopScan={stopScanning}
              onCopy={copyToClipboard}
            />
          </div>
        )}
      </div>
    </Card>
  );
}