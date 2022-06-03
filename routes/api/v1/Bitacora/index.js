const express = require('express');
const router = express.Router();
const Bitacora = require('../../../../libs/Bitacora');
const BitacoraDao = require('../../../../dao/models/BitacoraDao');
const bitaDao = new BitacoraDao();
const bita = new Bitacora(bitaDao);
bita.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await bita.getBitacoraVersion();
    return res.status(200).json(versionData);
  } catch ( ex ) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Bitacora', ex);
    return res.status(502).json({'error': 'Error Interno de Server'});
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const bitacora = await bita.getBitacoras();
    return res.status(200).json(bitacora);
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
    const registro = await bita.getBitacoraById({codigo: parseInt(codigo)});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {type = '', description = '', amount='',category = ''} = req.body;
    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }
    if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de type en INCOME o EXPENSES'
      });
    }
    const newBitacora = await bita.addBitacora({type,description,amount,category});
    return res.status(200).json(newBitacora);
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
    const {type = '', description = '', amount='',category = ''} = req.body;
    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }
    if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de type en INCOME o EXPENSES'
      });
    }

    const updateResult = await bita.updateBitacoras({type,description,amount,category,codigo:parseInt(codigo),});

    if (!updateResult) {
      return res.status(404).json({error:'bitacora no encontrada.'});
    }
    return res.status(200).json({updatedCategory:updateResult});

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

    const deletedBitacora = await bita.deleteBitacora({ codigo: parseInt(codigo)});

    if (!deletedBitacora) {
      return res.status(404).json({ error: 'Bitacora no encontrada.' });
    }
    return res.status(200).json({ deletedBitacora});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});


module.exports = router;
