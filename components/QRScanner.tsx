"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Copy, RefreshCw } from 'lucide-react';

export function QRScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);
    setScanResult(null);

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
          scannerRef.current?.clear();
        },
        (error) => {
          console.error(error);
          if (!scanResult) {
            setError("Failed to access camera. Please ensure you've granted camera permissions.");
          }
        }
      );
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions and try again.");
      setIsScanning(false);
      console.error(err);
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
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy the content to clipboard.",
        });
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setIsScanning(false);
      setError(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isScanning && !scanResult && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click the button below to start scanning a QR code
            </p>
            <Button onClick={startScanning} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Start Scanner
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="space-y-4">
            <div id="qr-reader" className="mx-auto" />
            <div className="text-center">
              <Button
                variant="outline"
                onClick={stopScanning}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {scanResult && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2">Scanned Result:</h3>
              <p className="break-all">{scanResult}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={copyToClipboard} variant="secondary" className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button onClick={startScanning} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Scan Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}