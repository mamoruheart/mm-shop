const router = require("express").Router();

const keys = require("../config/keys");
const apiRoutes = require("./api");

const { apiURL } = keys.app;
const api = `/${apiURL}`;

router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json("No API route found"));

module.exports = router;
