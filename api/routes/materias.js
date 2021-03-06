var express = require("express");
var router = express.Router();
var models = require("../models");
const materia = require("../models/materia");

router.get("/", (req, res) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;
  
  models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer
    })
    .then(materias => res.send(materias))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "id_carrera"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
