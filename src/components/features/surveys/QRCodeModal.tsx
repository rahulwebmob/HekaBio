/**
 * QR Code Modal
 * Generate and display QR code for survey links
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { IconDownload, IconCopy } from '@tabler/icons-react';
import { Modal, Button } from '../../ui';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyName: string;
}

export default function QRCodeModal({ isOpen, onClose, surveyId, surveyName }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [surveyUrl, setSurveyUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate survey URL
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/survey/${surveyId}`;
    setSurveyUrl(url);

    // Generate QR code
    if (canvasRef.current && isOpen) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#0F766E', // brand-600
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, [surveyId, isOpen]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `survey-qr-${surveyId}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Survey QR Code"
      size="md"
    >
      <div className="space-y-6">
        {/* Survey Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Survey Name</p>
          <p className="text-base font-semibold text-gray-900">{surveyName}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Survey URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Survey URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={surveyUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <Button
              variant="secondary"
              onClick={handleCopyUrl}
              leftIcon={<IconCopy size={18} />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Share this URL or scan the QR code to access the survey
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-brand-50 rounded-lg p-4 border border-brand-200">
          <p className="text-sm font-medium text-brand-900 mb-2">How to use:</p>
          <ul className="text-sm text-brand-700 space-y-1 list-disc list-inside">
            <li>Download the QR code image and include it in emails or documents</li>
            <li>Print the QR code for physical distribution</li>
            <li>Share the URL link directly via email or messaging</li>
            <li>Anyone with the link can access and submit the survey</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            leftIcon={<IconDownload size={18} />}
          >
            Download QR Code
          </Button>
        </div>
      </div>
    </Modal>
  );
}
