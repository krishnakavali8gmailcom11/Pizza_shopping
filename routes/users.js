const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET all pizza's list. */
/* This all information will be  retriverd from the user end */
router.get("/", function (req, res) {
  db.query("SELECT * FROM users", (err, row) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else if (row.length > 0) {
      res.send({ success: true, data: row, message: "Success" });
    } else {
      res.send({ success: false, message: "No data found!" });
    }
  });
});

/* GET signel user details.*/
router.get("/:userid", function (req, res) {
  let userid = req.params.userid;
  db.query("SELECT * FROM users where id=?", [userid], (err, row) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else if (row.length > 0) {
      res.send({ success: true, data: row, message: "Success" });
    } else {
      res.send({ success: false, message: "No data found!" });
    }
  });
});

/*Add Owner 
   [1]create_pizza
   [2]pizza_toppings
   [3]set_price
   to access this we can use front end frame work or postman method
*/
router.post("/addowner", function (req, res) {
  const data = req.body;
  const owner = {
    create_pizza: data.create_pizza,
    pizza_toppings: data.pizza_toppings,
    set_price: data.set_price
  };
  db.query("SELECT * FROM users WHERE create_pizza=?", [owner.create_pizza], (errs, rows) => {
    if (errs) {
      res.send({ success: false, message: errs });
    } else if (rows.length > 0) {
      res.send({
        success: true,
        message: "Already this pizza is added",
      });
    } else {
      db.query("INSERT INTO users SET ?", [owner], (err, result) => {
        if (err) {
          res.send({ success: false, message: err });
        } else {
          res.send({ success: true, message: "Pizza added succesfully!" });
        }
      });
    }
  });
});

/*Update pizzas using id*/
router.put("/updateowner/:userid", function (req, res) {
  const userid = req.params.userid;
  const data = req.body;
  // Columns check before updating.
  const columns = ["create_pizza", "pizza_toppings", "set_price"];
  let result = Object.keys(data).map((key) => {
    let output = columns.filter((col) => col === key).length;
    if (output === 0) {
      return false;
    } else {
      return true;
    }
  });
  if (result.filter((val) => val === false).length >= 1) {
    res.send({ success: false, message: "Unknown fields found!" });
  } else {
    // Data check before updating.
    db.query("SELECT * FROM users WHERE id=?", [userid], (errs, rows) => {
      if (errs) {
        res.send({ success: false, message: errs });
      } else if (rows.length > 0) {
        const owner = {
          create_pizza: data.create_pizza ? data.create_pizza : rows[0]["create_pizza"],
          pizza_toppings: data.pizza_toppings ? data.pizza_toppings : rows[0]["pizza_toppings"],
          set_price: data.set_price
            ? data.set_price
            : rows[0]["set_price"],
        };
        db.query(
          "UPDATE users SET ? WHERE id=?",
          [owner, userid],
          (err, result) => {
            if (err) {
              res.send({ success: false, message: errs });
            } else {
              res.send({
                success: true,
                message: "Pizza Updated  Successfully!",
              });
            }
          }
        );
      } else {
        res.send({ success: true, message: "User not found!" });
      }
    });
  }
});

/*  Delete already creaed pizza using id*/
router.delete("/deleteowner/:userid", function (req, res) {
  let userid = req.params.userid;
  db.query("DELETE FROM users where id=?", [userid], (err, result) => {
    if (err) {
      res.send({ success: false, message: "Error" });
    } else {
      res.send({ success: false, message: " Pizza Deleted Successfully!" });
    }
  });
});

module.exports = router;
