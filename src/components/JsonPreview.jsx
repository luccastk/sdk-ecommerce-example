import React, { useState } from "react";
import JsonModal from "./JsonModal";
import { Eye, ChevronRight } from "lucide-react";

const JsonPreview = ({ data, title, subtitle, maxLines = 4 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) {
    return (
      <div className="json-preview empty">
        <span className="empty-text">No data available</span>
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split("\n");
  const isLarge = lines.length > maxLines;
  const previewLines = isLarge ? lines.slice(0, maxLines) : lines;
  const hiddenLines = isLarge ? lines.length - maxLines : 0;

  return (
    <>
      <div
        className={`json-preview ${isLarge ? "clickable" : ""}`}
        onClick={isLarge ? () => setIsModalOpen(true) : undefined}
      >
        <div className="json-preview-header">
          <div className="preview-info">
            <span className="field-count">
              {typeof data === "object" ? Object.keys(data).length : 0} fields
            </span>
            {isLarge && (
              <span className="expand-hint">
                <Eye size={14} />
                Click to expand
              </span>
            )}
          </div>
          {isLarge && <ChevronRight size={16} className="expand-icon" />}
        </div>

        <pre className="json-preview-content">
          {previewLines.join("\n")}
          {hiddenLines > 0 && (
            <span className="truncated-indicator">
              \n... {hiddenLines} more lines
            </span>
          )}
        </pre>
      </div>

      <JsonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        subtitle={subtitle}
        data={data}
      />
    </>
  );
};

export default JsonPreview;
