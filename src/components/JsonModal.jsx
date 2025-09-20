import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CustomJsonView from "./CustomJsonView";
import { X, Copy, Download, Maximize2 } from "lucide-react";

const JsonModal = ({ isOpen, onClose, title, data, subtitle }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    // Você pode adicionar um toast aqui
    console.log("JSON copiado para clipboard!");
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="json-modal-overlay" />
        <Dialog.Content className="json-modal-content">
          <div className="json-modal-header">
            <div className="modal-title-section">
              <Dialog.Title className="json-modal-title">
                <Maximize2 size={20} />
                {title}
              </Dialog.Title>
              {subtitle && (
                <Dialog.Description className="json-modal-subtitle">
                  {subtitle}
                </Dialog.Description>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="modal-action-btn"
                onClick={copyToClipboard}
                title="Copy JSON"
              >
                <Copy size={16} />
              </button>
              <button
                className="modal-action-btn"
                onClick={downloadJson}
                title="Download JSON"
              >
                <Download size={16} />
              </button>
              <Dialog.Close className="modal-close-btn">
                <X size={18} />
              </Dialog.Close>
            </div>
          </div>

           <div className="json-modal-body">
             <CustomJsonView 
               data={data} 
               collapsed={2}
             />
           </div>

          <div className="json-modal-footer">
            <div className="json-stats">
              <span className="stat">
                {typeof data === "object" ? Object.keys(data).length : 0} fields
              </span>
              <span className="stat">{JSON.stringify(data).length} chars</span>
              <span className="stat">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default JsonModal;
