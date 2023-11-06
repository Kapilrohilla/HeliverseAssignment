const router = require("express").Router();
const { getDistinctDomains } = require("../controller/features");
router.get("/domain", getDistinctDomains);

module.exports = router;
