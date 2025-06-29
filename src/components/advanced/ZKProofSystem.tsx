import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useGlobalStore } from '../../store/globalStore';

interface ZKProof {
  id: string;
  fileId: string;
  proofHash: string;
  verified: boolean;
  timestamp: number;
}

export const ZKProofSystem: React.FC = () => {
  const [proofs, setProofs] = useState<ZKProof[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const { addNotification } = useGlobalStore();

  const generateZKProof = async (fileId: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate ZK proof generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newProof: ZKProof = {
        id: crypto.randomUUID(),
        fileId,
        proofHash: `zk_${Math.random().toString(36).substring(2, 15)}`,
        verified: true,
        timestamp: Date.now()
      };
      
      setProofs(prev => [newProof, ...prev]);
      
      addNotification({
        type: 'success',
        title: 'ZK Proof Generated',
        message: 'Zero-knowledge proof created successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Proof Generation Failed',
        message: 'Failed to generate zero-knowledge proof'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyProof = async (proofId: string) => {
    const proof = proofs.find(p => p.id === proofId);
    if (!proof) return;

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addNotification({
      type: 'success',
      title: 'Proof Verified',
      message: 'Zero-knowledge proof verification successful'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Zero-Knowledge Proof System</h3>
            <p className="text-sm text-gray-600">Verify access without revealing file metadata</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Generate New Proof</h4>
            <div className="space-y-3">
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select a file</option>
                <option value="file1">financial_report.pdf</option>
                <option value="file2">contract_draft.docx</option>
                <option value="file3">medical_records.json</option>
              </select>
              
              <button
                onClick={() => generateZKProof(selectedFile)}
                disabled={!selectedFile || isGenerating}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Proof...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Generate ZK Proof</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Privacy Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <EyeOff className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Metadata Hidden</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Access Verified</span>
                </div>
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Zero Knowledge</span>
                </div>
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Proof History</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {proofs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No proofs generated yet</p>
            </div>
          ) : (
            proofs.map((proof) => (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      proof.verified ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {proof.verified ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">File ID: {proof.fileId}</p>
                      <p className="text-sm text-gray-500">Proof: {proof.proofHash}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(proof.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proof.verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proof.verified ? 'Verified' : 'Pending'}
                    </span>
                    
                    {proof.verified && (
                      <button
                        onClick={() => verifyProof(proof.id)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Re-verify
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};