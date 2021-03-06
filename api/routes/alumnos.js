var express = require("express");
const { sequelize } = require("../models");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;
  
  models.alumno
    .findAll({
      attributes: ["id", "apellido", "nombre", "dni"],
      include:[
        {as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}, 
        {as: 'Notas', model: models.nota, attributes: { exclude: ["createdAt", "updatedAt"] }},
      ],
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer
    })
    .then(alumnos => res.send(alumnos))
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
  });
});

router.post("/", (req, res) => {
  models.alumno
    .create({ apellido: req.body.apellido, nombre: req.body.nombre, dni:req.body.dni, id_carrera: req.body.id_carrera })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "apellido", "nombre", "dni"],
      include:[
        {as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}, 
        {as: 'Notas', model: models.nota, attributes: { exclude: ["id_alumno", "createdAt", "updatedAt"]}},
      ],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({ apellido: req.body.apellido, nombre: req.body.nombre, dni: req.body.dni, id_carrera: req.body.id_carrera }, { fields: ["apellido", "nombre", "dni", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
