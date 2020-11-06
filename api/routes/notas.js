var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;

  models.nota
    .findAll({
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer
    })
    .then(notas => res.send(notas))
    .catch((err) => {
        res.sendStatus(500);
        console.log(err);
    });
});

router.post("/", (req, res) => {
  models.nota
    .create({ id_materia: req.body.id_materia, id_alumno: req.body.id_alumno, calificacion: req.body.calificacion })
    .then(nota => res.status(201).send({ id: nota.id }))
    .catch((err) => {
        res.sendStatus(500);
        console.log(err);
    });
});

const findNota = (id, { onSuccess, onNotFound, onError }) => {
  models.nota
    .findOne({
      where: { id }
    })
    .then(nota => (nota ? onSuccess(nota) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findNota(req.params.id, {
    onSuccess: nota => res.send(nota),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = nota =>
    nota
      .update({ calificacion: req.body.calificacion }, { fields: ["calificacion"] })
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
    findNota(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = nota =>
    nota
      .destroy()
      .then(() => res.sendStatus(200))
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
    });
  findNota(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
