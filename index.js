import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Image from "./Models/Img.model.js"

//import md5 from "md5";
import bcrypt from "bcrypt";
import RegisterModel from "./Models/Register.model.js";
import base64 from "base-64";

import validator from "./Middleware/Validator.middleware.js";

//TrRrMZenGSj0hosD
//mongodb+srv://mdfaizurrahman297:<db_password>@cluster0.jpjo8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const app = express();
mongoose
  .connect(
    "mongodb+srv://mdfaizurrahman297:TrRrMZenGSj0hosD@cluster0.jpjo8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((response) => {
    // console.log("mongo DB connected=>",response)
    console.log("mongo DB connected");
  })
  .catch((err) => {
    // console.log("databse not connected=>",err)
    console.log("databse not connected");
  });

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.post("/", validator, (req, res) => {
  const {img} = req.body;
  const newData = new Image({ img });
  newData
    .save()
    .then((data) => {
      res.status(201).json({
        Status: "succes",
        message: "Data save in database succesfully..",
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Error while saving data in Database..",
      });
    });
  //res.json({ message: "Data received" });
});

app.get("/", validator, (req, res) => {
  Image.find()
    .then((data) => {
      res.status(201).json({ Status: "succes", message: data ,imageURL:data});
    })
    .catch((err) => {
      res.status(500).json({
        status: "failed",
        message: "Error while getting data from Database..",
      });
    });
});

// app.get("/name/:name", validator, (req, res) => {
//   const Name = req.params.name;
//   GulabData.findOne({ name: Name })
//     .then((data) => {
//       res.status(201).json({ Status: "succes", message: data });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         status: "failed",
//         message: "Error while getting data from Database..",
//       });
//     });
// });

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is listening on port 3000");
});

// register and login codes--------------------------------------------------------------------------------------

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await RegisterModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "User Already exist.." });
    }

    //   const hashedPassword = md5(password);
    const hashedPassword = await bcrypt.hash(password, 10); // used for hashing password

    const newUser = new RegisterModel({
      name,
      email,
      password: hashedPassword,
    });

    newUser
      .save()
      .then((resData) => {
        res.status(201).json({
          Status: "succes",
          message: "Account created successfully..",
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "failed",
          message: "Account can't created please try agin later..",
        });
      });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Account can't created please try agin later..",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await RegisterModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ status: "failure", message: "Please use Register email.." });
    }

    // const hashedPassword = md5(password);
    const MatchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (MatchedPassword) {
      const token = await base64.encode(`${email}:${password}`); // here encryption
      res
        .status(200)
        .json({ Status: "success", message: "Login successfully..", token });
    } else {
      return res
        .status(400)
        .json({ status: "failure", message: "Inncorrect Password.." });
    }
  } catch (err) {
    {
      res.status(500).json({
        Status: "Failur",
        message:
          "User cannot be authenticate this time please try again later..",
      });
    }
  }
});

