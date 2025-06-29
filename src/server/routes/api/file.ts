import { Router } from 'express';
import { fileController } from '../../controllers/file';
import { validateRequest } from '../../middleware/validateRequest';
import { uploadSchema } from '../../schemas/file';

const router = Router();

router.post('/upload', validateRequest(uploadSchema), fileController.upload);
router.get('/:id', fileController.getFile);
router.post('/:id/access', fileController.grantAccess);
router.delete('/:id/access', fileController.revokeAccess);

export { router as fileRouter };