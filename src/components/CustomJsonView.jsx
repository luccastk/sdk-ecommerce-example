import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const CustomJsonView = ({ data, collapsed = 1, currentLevel = 0 }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const toggleKey = (key) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  const renderValue = (value, key, level) => {
    const isExpanded = expandedKeys.has(`${level}-${key}`);
    const shouldCollapse = level >= collapsed;

    if (value === null) {
      return <span className="json-null">null</span>;
    }

    if (typeof value === "boolean") {
      return <span className="json-boolean">{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span className="json-number">{value}</span>;
    }

    if (typeof value === "string") {
      // Truncate long strings
      const truncated =
        value.length > 50 ? value.substring(0, 50) + "..." : value;
      return <span className="json-string">"{truncated}"</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="json-bracket">[]</span>;
      }

      return (
        <div className="json-array">
          <span className="json-bracket">
            <button
              className="collapse-btn"
              onClick={() => toggleKey(`${level}-${key}`)}
            >
              {isExpanded || !shouldCollapse ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
            [{value.length}]
          </span>
          {(isExpanded || !shouldCollapse) && (
            <div className="json-nested">
              {value.map((item, index) => (
                <div key={index} className="json-item">
                  <span className="json-index">{index}:</span>
                  {renderValue(item, `${key}-${index}`, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return <span className="json-bracket">{"{}"}</span>;
      }

      return (
        <div className="json-object">
          <span className="json-bracket">
            <button
              className="collapse-btn"
              onClick={() => toggleKey(`${level}-${key}`)}
            >
              {isExpanded || !shouldCollapse ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
            {"{"}
            <span className="object-size">{keys.length}</span>
            {"}"}
          </span>
          {(isExpanded || !shouldCollapse) && (
            <div className="json-nested">
              {keys.map((objKey) => (
                <div key={objKey} className="json-item">
                  <span className="json-key">"{objKey}":</span>
                  {renderValue(value[objKey], `${key}-${objKey}`, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="json-unknown">{String(value)}</span>;
  };

  return (
    <div className="custom-json-view">
      {renderValue(data, "root", currentLevel)}
    </div>
  );
};

export default CustomJsonView;
