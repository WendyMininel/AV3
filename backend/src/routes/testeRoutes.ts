import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import { listarTestes, criarTeste } from '../controllers/testeController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);

router.get('/', listarTestes);
router.post('/', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), criarTeste);

export default router;