const express = require("express");
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const albumController = require('./src/controllers/albumController')
const lettersController = require('./src/controllers/lettersController')
const diaryController = require('./src/controllers/diaryController')

// ROTAS DA HOME
route.get("/", homeController.homePage);
route.post("/", homeController.treatPost);

// ROTAS DO ÁLBUM
route.get("/pictures", albumController.homePage);

// ROTAS DAS CARTAS
route.get("/letters", lettersController.homePage);

// ROTAS DO DIARIO/CHAT
route.get("/diary", diaryController.homePage);


module.exports = route;