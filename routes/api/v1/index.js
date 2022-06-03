const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./usuarios');
const categoriasRoutes = require('./categorias');
const bitacorasRoutes = require('./Bitacora');

router.use('/usuarios', usuariosRoutes);
router.use('/categories', categoriasRoutes);
router.use('/bitacoras', bitacorasRoutes);

module.exports = router;
