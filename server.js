const express = require("express");
const  cors = require("cors");
const  bodyParser = require("body-parser");
const  port = process.env.PORT || 8080;

/*express config*/
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*routes*/
const usersRouter = require("./routes/users");
app.get("/", (req, res) => {
  res.send({message:"Welcome to REST API"});
});

app.use("/api/users/", usersRouter);

/*server*/
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
