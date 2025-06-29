import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface AddressInputProps {
  onAdd: (address: string) => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({ onAdd }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      onAdd(address);
      setAddress('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Ethereum address"
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <Button type="submit" className="flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Add
      </Button>
    </form>
  );
};