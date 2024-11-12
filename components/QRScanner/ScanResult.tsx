"use client";

interface ScanResultProps {
  result: string;
}

export function ScanResult({ result }: ScanResultProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="font-medium mb-2">Scanned Result:</h3>
      <p className="break-all">{result}</p>
    </div>
  );
}