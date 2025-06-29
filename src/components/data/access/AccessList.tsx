import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../../ui/Button';

interface AccessListProps {
  addresses: string[];
  onRevoke: (address: string) => void;
}

export const AccessList: React.FC<AccessListProps> = ({ addresses, onRevoke }) => {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address} className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono">{address}</span>
          </div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onRevoke(address)}
          >
            Revoke
          </Button>
        </div>
      ))}
    </div>
  );
};