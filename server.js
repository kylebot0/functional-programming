const express = require("express"),
  app = express();
const port = 3000;


app
  .use(express.static(__dirname + '/src'))
  .set('view engine', 'html')
  .get("/", (req, res) => res.render("index", {}))
  .listen(port, () => console.log(`Example app listening on port ${port}`))
;
