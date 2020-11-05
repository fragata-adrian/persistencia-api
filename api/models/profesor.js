'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define('profesor', {
    apellido: DataTypes.STRING,
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER
  }, {});
  profesor.associate = function(models) {
    profesor.belongsTo(models.materia, {
      as : 'Materia-Dictada',
      foreignKey: 'id_materia'
    })
  };
  return profesor;
};