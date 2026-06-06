import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import {
  listarPecas,
  criarPeca,
  atualizarStatusPeca,
  deletarPeca
} from '../controllers/pecaController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);

router.get('/', listarPecas);
router.post('/', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), criarPeca);
router.patch('/:id/status', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), atualizarStatusPeca);
router.delete('/:id', verificarPermissao(['ADMINISTRADOR']), deletarPeca);

export default router;