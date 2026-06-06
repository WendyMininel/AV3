import { Router } from 'express';
import { authMiddleware, verificarPermissao } from '../middleware/authMiddleware';
import { metricsMiddleware } from '../middleware/metricsMiddleware';
import {
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  deletarFuncionario
} from '../controllers/funcionarioController';

const router = Router();

router.use(authMiddleware);
router.use(metricsMiddleware);

router.get('/', listarFuncionarios);
router.post('/', verificarPermissao(['ADMINISTRADOR']), criarFuncionario);
router.put('/:id', verificarPermissao(['ADMINISTRADOR']), atualizarFuncionario);
router.delete('/:id', verificarPermissao(['ADMINISTRADOR']), deletarFuncionario);

export default router;