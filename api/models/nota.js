'use strict';
module.exports = (sequelize, DataTypes) => {
  const nota = sequelize.define('nota', {
    id_materia: DataTypes.INTEGER,
    id_alumno: DataTypes.INTEGER,
    calificacion: DataTypes.FLOAT
  }, {});
  nota.associate = function(models) {
    // Asociacion de uno
    // tiene una...
    nota.hasOne(models.alumno, {
      foreignKey: 'id', // Clave referenciada en tabla externa 'alumno'
      sourceKey: 'id_alumno' // Clave en la table notas
    })
    nota.hasOne(models.materia, {
      foreignKey: 'id', // Clave referenciada en tabla externa 'materia'
      sourceKey: 'id_materia' // Clave en la table notas
    })
  };
  return nota;
};