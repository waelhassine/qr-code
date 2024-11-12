"use client";
import { useState } from "react";
import { useZxing } from "react-zxing";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const QRScanner = () => {
  const [result, setResult] = useState<string | null>(null);
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <video ref={ref} style={{ width: "100%" }} />
        {result && (
          <div className="space-y-4">
            <p>Scanned Result: {result}</p>
            <Button onClick={() => setResult(null)}>Scan Again</Button>
          </div>
        )}
      </div>
    </Card>
  );
};
