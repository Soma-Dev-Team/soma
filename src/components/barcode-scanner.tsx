'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { LoadingRing } from './loading-ring';

export function BarcodeScanner({
  onDetect,
  onError,
}: {
  onDetect: (code: string) => void;
  onError?: (err: Error) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let stop = false;
    let controls: { stop: () => void } | null = null;

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const deviceId =
          devices.find((d) => /back|rear|environment/i.test(d.label))?.deviceId ?? devices[0]?.deviceId;
        if (!videoRef.current) return;
        controls = await reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (stop) return;
          if (result) {
            const code = result.getText();
            controls?.stop();
            stop = true;
            onDetect(code);
          }
        });
        setActive(true);
      } catch (e: any) {
        onError?.(e);
      }
    })();

    return () => {
      stop = true;
      controls?.stop();
    };
  }, [onDetect, onError]);

  return (
    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-black">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-1 bg-accent shadow-[0_0_24px] shadow-accent" />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 text-white text-sm">
          <LoadingRing size={20} /> <span>Starting camera…</span>
        </div>
      )}
    </div>
  );
}
