import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import {
  listarEtapas,
  criarEtapa,
  iniciarEtapa,
  finalizarEtapa,
  associarFuncionario
} from '../controllers/etapaController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);

router.get('/', listarEtapas);
router.post('/', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), criarEtapa);
router.patch('/:id/iniciar', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), iniciarEtapa);
router.patch('/:id/finalizar', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO', 'OPERADOR']), finalizarEtapa);
router.post('/:id/funcionarios', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), associarFuncionario);

export default router;