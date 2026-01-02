/**
 * QR Code Generator Component
 * Generates QR codes for survey links using external API
 */

import { useState } from 'react';
import { IconDownload, IconQrcode } from '@tabler/icons-react';
import { Button } from '../ui';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  title?: string;
}

export function QRCodeGenerator({ url, size = 256, title }: QRCodeGeneratorProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  // Using QR Server API (free, no API key required)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    url
  )}`;

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `survey-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {!isGenerated ? (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300">
            <div className="text-center">
              <IconQrcode size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Preview</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">
              {title || 'Generate a QR code for easy mobile access'}
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconQrcode size={16} />}
              onClick={handleGenerate}
            >
              Generate QR Code
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex-shrink-0">
              <img
                src={qrCodeUrl}
                alt="Survey QR Code"
                className="w-32 h-32 rounded-lg border-2 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-2">QR Code Generated!</p>
              <p className="text-xs text-gray-600 mb-3">
                Scan this code with a mobile device to access the survey
              </p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconDownload size={16} />}
                onClick={handleDownload}
              >
                Download QR Code
              </Button>
            </div>
          </div>
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
            <p className="text-xs text-brand-800">
              <strong>Tip:</strong> Print this QR code on event materials, presentations, or
              email signatures for easy survey access
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
