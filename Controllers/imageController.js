import Image from "../Models/Img.model.js";


export const saveImage = (req, res) => {
  const { img } = req.body;
  const newData = new Image({ img });
  newData.save()
    .then(() => {
      res.status(201).json({ Status: "success", message: "Data saved in database successfully." });
    })
    .catch(() => {
      res.status(500).json({ status: "failed", message: "Error while saving data in Database." });
    });
};

export const getImages = (req, res) => {
  Image.find()
    .then((data) => {
      res.status(200).json({ Status: "success", message: data, imageURL: data });
    })
    .catch(() => {
      res.status(500).json({ status: "failed", message: "Error while getting data from Database." });
    });
};
