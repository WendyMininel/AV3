import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import { gerarRelatorio } from '../controllers/relatorioController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);
router.post('/gerar', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), gerarRelatorio);

export default router;