"use client";

import { Button } from '@/components/ui/button';
import { Camera, Copy, RefreshCw } from 'lucide-react';

interface ScannerControlsProps {
  isScanning: boolean;
  scanResult: string | null;
  onStartScan: () => void;
  onStopScan: () => void;
  onCopy: () => void;
}

export function ScannerControls({
  isScanning,
  scanResult,
  onStartScan,
  onStopScan,
  onCopy
}: ScannerControlsProps) {
  if (isScanning) {
    return (
      <div className="text-center">
        <Button variant="outline" onClick={onStopScan}>
          Cancel
        </Button>
      </div>
    );
  }

  if (scanResult) {
    return (
      <div className="flex gap-2 justify-center">
        <Button onClick={onCopy} variant="secondary" className="gap-2">
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button onClick={onStartScan} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Scan Again
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onStartScan} size="lg" className="gap-2">
      <Camera className="w-5 h-5" />
      Start Scanner
    </Button>
  );
}