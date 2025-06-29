import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.analytics': 'Analytics',
      'nav.roles': 'Role Management',
      'nav.layer2': 'Layer 2',
      'nav.security': 'Security',
      'nav.files': 'File Manager',
      'nav.activity': 'Activity Log',
      'nav.settings': 'Settings',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.upload': 'Upload Data',
      'dashboard.access_control': 'Access Control',
      'dashboard.audit_log': 'Audit Log',
      
      // File Operations
      'files.upload': 'Upload File',
      'files.download': 'Download',
      'files.share': 'Share',
      'files.delete': 'Delete',
      'files.drag_drop': 'Drag and drop files here, or click to select',
      'files.connect_wallet': 'Please connect your wallet to upload files',
      
      // Access Control
      'access.grant': 'Grant Access',
      'access.revoke': 'Revoke Access',
      'access.add_user': 'Add User',
      'access.enter_address': 'Enter Ethereum address',
      
      // Notifications
      'notifications.title': 'Notifications',
      'notifications.clear_all': 'Clear all',
      'notifications.no_notifications': 'No notifications yet',
      'notifications.file_uploaded': 'File uploaded successfully',
      'notifications.access_granted': 'Access granted',
      'notifications.access_revoked': 'Access revoked',
      
      // Wallet
      'wallet.connect': 'Connect Wallet',
      'wallet.disconnect': 'Disconnect',
      'wallet.connected': 'Connected',
      'wallet.not_connected': 'Not connected',
      
      // Common
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.create': 'Create',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success'
    }
  },
  es: {
    translation: {
      'nav.dashboard': 'Panel de Control',
      'nav.analytics': 'Analíticas',
      'nav.roles': 'Gestión de Roles',
      'nav.layer2': 'Capa 2',
      'nav.security': 'Seguridad',
      'nav.files': 'Gestor de Archivos',
      'nav.activity': 'Registro de Actividad',
      'nav.settings': 'Configuración',
      
      'dashboard.title': 'Panel de Control',
      'dashboard.upload': 'Subir Datos',
      'dashboard.access_control': 'Control de Acceso',
      'dashboard.audit_log': 'Registro de Auditoría',
      
      'files.upload': 'Subir Archivo',
      'files.download': 'Descargar',
      'files.share': 'Compartir',
      'files.delete': 'Eliminar',
      'files.drag_drop': 'Arrastra y suelta archivos aquí, o haz clic para seleccionar',
      'files.connect_wallet': 'Por favor conecta tu billetera para subir archivos',
      
      'wallet.connect': 'Conectar Billetera',
      'wallet.disconnect': 'Desconectar',
      'wallet.connected': 'Conectado',
      'wallet.not_connected': 'No conectado'
    }
  },
  fr: {
    translation: {
      'nav.dashboard': 'Tableau de Bord',
      'nav.analytics': 'Analytiques',
      'nav.roles': 'Gestion des Rôles',
      'nav.layer2': 'Couche 2',
      'nav.security': 'Sécurité',
      'nav.files': 'Gestionnaire de Fichiers',
      'nav.activity': 'Journal d\'Activité',
      'nav.settings': 'Paramètres',
      
      'dashboard.title': 'Tableau de Bord',
      'dashboard.upload': 'Télécharger des Données',
      'dashboard.access_control': 'Contrôle d\'Accès',
      'dashboard.audit_log': 'Journal d\'Audit',
      
      'files.upload': 'Télécharger un Fichier',
      'files.download': 'Télécharger',
      'files.share': 'Partager',
      'files.delete': 'Supprimer',
      'files.drag_drop': 'Glissez et déposez les fichiers ici, ou cliquez pour sélectionner',
      'files.connect_wallet': 'Veuillez connecter votre portefeuille pour télécharger des fichiers',
      
      'wallet.connect': 'Connecter le Portefeuille',
      'wallet.disconnect': 'Déconnecter',
      'wallet.connected': 'Connecté',
      'wallet.not_connected': 'Non connecté'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;