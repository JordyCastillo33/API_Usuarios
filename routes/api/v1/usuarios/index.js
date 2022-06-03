const express = require('express');
const router = express.Router();
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
user.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await user.getUserVersion();
    return res.status(200).json(versionData);
  } catch ( ex ) {
    // manejar el error que pueda tirar el controlador
    console.error('Error User', ex);
    return res.status(502).json({'error': 'Error Interno de Server'});
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const usuarios = await user.getUsuarios();
    return res.status(200).json(usuarios);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const {codigo} = req.params;
    if (!(/^\d+$/.test(codigo))){
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await user.getUsuarioById({codigo: parseInt(codigo)});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {email = '',password = '',nombre = '',avatar = '',estado = ''} = req.body;
    if (/^\s*$/.test(email)) {
      return res.status(400).json({
        error: 'Se espera valor de email'
      });
    }
    if (/^\s*$/.test(nombre)) {
      return res.status(400).json({
        error: 'Se espera valor de nombre'
      });
    }
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de password'
      });
    }
    if (/^\s*$/.test(avatar)) {
      return res.status(400).json({
        error: 'Se espera valor de avatar'
      });
    }


    if (!(/^(ACT)|(INA)$/.test(estado))) {
      return res.status(400).json({
        error: 'Se espera valor de estado en ACT o INA'
      });
    }
    const newUsuario = await user.addUsuarios({email,
        nombre,
        avatar,
        password,
        estado});
    return res.status(200).json(newUsuario);
  } catch(ex){
    console.error(ex);
    return res.status(502).json({error:'Error al procesar solicitud'});
  }
});

router.put('/update/:codigo', async (req, res)=>{
  try {
    const {codigo} = req.params;
    if(!(/^\d+$/.test(codigo))) {
      return res.status(400).json({error:'El codigo debe ser un dígito válido.'});
    }
    const {email = '',password = '',nombre = '',avatar = '',estado = ''} = req.body;

    if (/^\s*$/.test(email)) {
      return res.status(400).json({
        error: 'Se espera valor de email'
      });
    }
    if (/^\s*$/.test(nombre)) {
      return res.status(400).json({
        error: 'Se espera valor de nombre'
      });
    }
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de password'
      });
    }
    if (/^\s*$/.test(avatar)) {
      return res.status(400).json({
        error: 'Se espera valor de avatar'
      });
    }
    if (!(/^(ACT)|(INA)$/.test(estado))) {
      return res.status(400).json({
        error: 'Se espera valor de estado en ACT o INA'
      });
    }

    const updateResult = await user.updateUsuarios({
        email,
        nombre,
        avatar,
        password,
        estado,codigo:parseInt(codigo)});

    if (!updateResult) {
      return res.status(404).json({error:'Usuario no encontrado.'});
    }
    return res.status(200).json({updateUsuarios:updateResult});

  } catch(ex) {
    console.error(ex);
    res.status(500).json({error: 'Error al procesar solicitud.'});
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedCategory = await user.deleteUsuario({ codigo: parseInt(codigo)});

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    return res.status(200).json({ deletedCategory});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

router.put('/getUsuarioById/:codigo', async (req, res)=>{
  try {
    const {codigo} = req.params;
    if(!(/^\d+$/.test(codigo))) {
      return res.status(400).json({error:'El codigo debe ser un dígito válido.'});
    }


    const categories = await getUsuarioById({codigo:parseInt(codigo)});
    

    if (!categories) {
      return res.status(404).json({error:'Categoria no encontrada.'});
    }
    return res.status(200).json(categories);

  } catch(ex) {
    console.error(ex);
    res.status(500).json({error: 'Error al procesar solicitud.'});
  }
});

module.exports = router;