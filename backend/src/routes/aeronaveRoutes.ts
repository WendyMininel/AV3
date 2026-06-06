import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import {
  listarAeronaves,
  buscarAeronave,
  criarAeronave,
  atualizarAeronave,
  deletarAeronave
} from '../controllers/aeronaveController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);

router.get('/', listarAeronaves);
router.get('/:codigo', buscarAeronave);
router.post('/', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), criarAeronave);
router.put('/:codigo', verificarPermissao(['ADMINISTRADOR', 'ENGENHEIRO']), atualizarAeronave);
router.delete('/:codigo', verificarPermissao(['ADMINISTRADOR']), deletarAeronave);

export default router;