'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
  	//asociacion a carrera (pertenece a:)
  	materia.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    })
    // Asociacion de uno a muchos
    // tiene muchas..
    materia.hasMany(models.nota, {
      foreignKey: 'id_materia', // Clave foranea en tabla externa 'notas'
      sourceKey: 'id' // Clave primaria referenciada para la asociacion
    })
  };
  return materia;
};