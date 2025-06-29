import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '../ui/Button';

interface AccessControlProps {
  dataId: string;
  currentAccess: string[];
}

export const AccessControl: React.FC<AccessControlProps> = ({ dataId, currentAccess }) => {
  const handleAddUser = (address: string) => {
    console.log(`Adding user ${address} to ${dataId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Access Control</h3>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleAddUser('')}
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>
      
      <div className="space-y-4">
        {currentAccess.map((address) => (
          <div key={address} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{address}</span>
            </div>
            <Button variant="danger" size="sm">Revoke</Button>
          </div>
        ))}
      </div>
    </div>
  );
};