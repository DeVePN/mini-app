'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Card } from './Card';
import { Button } from './Button';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { downloadWireGuardConfig, copyToClipboard } from '@/utils/wireguard';

interface QRCodeDisplayProps {
  config: string;
  filename?: string;
}

export function QRCodeDisplay({ config, filename = 'devpn.conf' }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    downloadWireGuardConfig(config, filename);
  };

  return (
    <Card className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">WireGuard Configuration</h3>
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
            <QRCodeSVG value={config} size={200} level="M" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code with your WireGuard app
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Config
            </>
          )}
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
          View configuration file
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
          {config}
        </pre>
      </details>
    </Card>
  );
}
