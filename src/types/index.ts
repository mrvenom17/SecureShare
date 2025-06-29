export interface Organization {
  id: string;
  name: string;
  address: string;
}

export interface DataAsset {
  id: string;
  ownerId: string;
  encryptedData: string;
  metadata: {
    title: string;
    description: string;
    timestamp: number;
  };
  accessControl: {
    readAccess: string[];
    writeAccess: string[];
  };
}