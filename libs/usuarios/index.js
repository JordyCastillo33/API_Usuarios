const DaoObject = require('../../dao/DaoObject');
module.exports = class Category {
  usuarioDao = null;

  constructor( usuarioDao = null) {
    if (!(usuarioDao instanceof DaoObject)) {
     throw new Error('An Instance of DAO Object is Required');
    }
    this.usuarioDao = usuarioDao;
  }
  async init(){
    await this.usuarioDao.init();
    this.usuarioDao.setup();
  }
  async getUserVersion () {
    return {
      entity: 'Usuarios',
      version: '1.0.0',
      description: 'CRUD de Usuarios'
    };
  }

  async addUsuarios ({
    email,
    nombre,
    avatar,
    password,
    estado
  }) {
    const result =  await this.usuarioDao.insertOne(
      {
        email,
        nombre,
        avatar,
        password,
        estado
      }
    );
    return {
        email,
        nombre,
        avatar,
        password,
        estado, 
        id: result.lastID
    };
  };

  async getUsuarios () {
    return this.usuarioDao.getAll();
  }

  async getUsuarioById ({ codigo }) {
    return this.usuarioDao.getById({codigo});
  }

  async updateUsuarios ({ 
    email,
    nombre,
    avatar,
    password,
    estado,
    codigo
  }) {
    const result = await this.usuarioDao.updateOne({ 
        email,
        nombre,
        avatar,
        password,
        estado,
        codigo
     });
    return {
        email,
        nombre,
        avatar,
        password,
        estado,
        codigo,
        modified: result.changes
    }
  }

  async deleteUsuario({ codigo }) {
    const cateToDelete = await this.usuarioDao.getById({codigo});
    const result = await this.usuarioDao.deleteOne({ codigo });
    return {
      ...cateToDelete,
      deleted: result.changes
    };
  }
}