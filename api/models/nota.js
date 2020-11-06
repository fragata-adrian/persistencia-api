'use strict';
module.exports = (sequelize, DataTypes) => {
  const nota = sequelize.define('nota', {
    id_materia: DataTypes.INTEGER,
    id_alumno: DataTypes.INTEGER,
    calificacion: DataTypes.FLOAT
  }, {});
  nota.associate = function(models) {
    nota.hasOne(models.alumno, {
      foreignKey: 'id',
      sourceKey: 'id_alumno'
    })
    nota.hasOne(models.materia, {
      foreignKey: 'id',
      sourceKey: 'id_materia'
    })
  };
  return nota;
};