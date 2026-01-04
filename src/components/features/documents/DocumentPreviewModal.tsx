/**
 * Document Preview Modal
 * Preview documents (PDF, images, text files) in a modal
 */

import { useState, useEffect } from 'react';
import {
  IconDownload,
  IconZoomIn,
  IconZoomOut,
  IconRotateClockwise,
  IconMaximize,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { Modal, Button } from '../../ui';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: number;
  } | null;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  document: doc,
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1); // For future multi-page document support

  useEffect(() => {
    // Reset state when document changes
    if (doc) {
      setZoom(100);
      setRotation(0);
      setCurrentPage(1);
    }
  }, [doc]);

  if (!doc) return null;

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    const elem = window.document.getElementById('preview-content');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  const renderPreview = () => {
    const fileExtension = doc.name.split('.').pop()?.toLowerCase();
    const mimeType = doc.type.toLowerCase();

    // PDF Preview
    if (mimeType === 'application/pdf' || fileExtension === 'pdf') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <iframe
            src={doc.url}
            className="w-full h-full border-none"
            title={doc.name}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          />
        </div>
      );
    }

    // Image Preview
    if (
      mimeType.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension || '')
    ) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-auto">
          <img
            src={doc.url}
            alt={doc.name}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          />
        </div>
      );
    }

    // Text Preview
    if (
      mimeType.startsWith('text/') ||
      ['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(fileExtension || '')
    ) {
      return (
        <div className="w-full h-full bg-white p-6 overflow-auto">
          <iframe
            src={doc.url}
            className="w-full h-full border-none"
            title={doc.name}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      );
    }

    // Unsupported file type
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-200">
            <IconDownload size={48} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview Not Available</h3>
          <p className="text-gray-600 mb-6">
            This file type cannot be previewed in the browser. Please download the file to view it.
          </p>
          <Button variant="primary" onClick={handleDownload} leftIcon={<IconDownload size={18} />}>
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doc.name}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Size unknown'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{doc.type}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleDownload}
              leftIcon={<IconDownload size={18} />}
            >
              Download
            </Button>
          </div>
        </div>
      }
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
            >
              <IconZoomOut size={18} />
            </button>
            <span className="px-3 py-2 text-sm font-medium border-x border-gray-300 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
            >
              <IconZoomIn size={18} />
            </button>
          </div>

          {/* Rotation */}
          <button
            onClick={handleRotate}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Rotate"
          >
            <IconRotateClockwise size={18} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Fullscreen"
          >
            <IconMaximize size={18} />
          </button>
        </div>

        {/* Page Navigation (for multi-page documents) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <IconChevronLeft size={18} />
            </button>
            <span className="px-3 py-2 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div id="preview-content" className="flex-1 overflow-hidden">
        {renderPreview()}
      </div>
    </Modal>
  );
}
