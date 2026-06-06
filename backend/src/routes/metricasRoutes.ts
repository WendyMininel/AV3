import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { obterMetricas, obterMetricasGraficos } from '../controllers/metricasController';

const router = Router();

router.use(authMiddleware);
router.get('/', verificarPermissao(['ADMINISTRADOR']), obterMetricas);
router.get('/graficos', verificarPermissao(['ADMINISTRADOR']), obterMetricasGraficos);

export default router;