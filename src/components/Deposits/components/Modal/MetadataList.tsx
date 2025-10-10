import React from 'react';

// Type for metadata items
export interface DepositMetadata {
  key: string;
  value: string;
}

interface MetadataListProps {
  metadata: DepositMetadata[] | null;
}

const MetadataList: React.FC<MetadataListProps> = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className="modal-metadata-box">
      {metadata.map(({ key, value }) => (
        <div key={key} className="modal-metadata-row">
          <span className="modal-detail-label">{key}</span>
          <span className="modal-detail-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default MetadataList;
