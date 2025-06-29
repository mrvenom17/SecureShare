import CryptoJS from 'crypto-js';

class EncryptionService {
  private readonly algorithm = 'AES';
  
  generateKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  encrypt(data: string, key: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, key).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: string, key: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Invalid key or corrupted data');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  encryptFile(file: File, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const encrypted = this.encrypt(content, key);
          resolve(encrypted);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  generateSecurePassword(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  validateKeyStrength(key: string): { isStrong: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (key.length >= 8) score += 1;
    else feedback.push('Key should be at least 8 characters long');

    if (key.length >= 16) score += 1;
    else feedback.push('Key should be at least 16 characters for better security');

    if (/[a-z]/.test(key)) score += 1;
    else feedback.push('Key should contain lowercase letters');

    if (/[A-Z]/.test(key)) score += 1;
    else feedback.push('Key should contain uppercase letters');

    if (/[0-9]/.test(key)) score += 1;
    else feedback.push('Key should contain numbers');

    if (/[^a-zA-Z0-9]/.test(key)) score += 1;
    else feedback.push('Key should contain special characters');

    return {
      isStrong: score >= 4,
      score: Math.min(score, 5),
      feedback
    };
  }
}

export const encryptionService = new EncryptionService();