"use client";

import { Camera } from 'lucide-react';
import { ScannerControls } from './ScannerControls';

interface ReadyStateProps {
  onStartScan: () => void;
}

export function ReadyState({ onStartScan }: ReadyStateProps) {
  return (
    <div className="text-center py-12">
      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Click the button below to start scanning a QR code
      </p>
      <ScannerControls
        isScanning={false}
        scanResult={null}
        onStartScan={onStartScan}
        onStopScan={() => {}}
        onCopy={() => {}}
      />
    </div>
  );
}