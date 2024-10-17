import bcrypt from "bcrypt";
import RegisterModel from "../Models/Register.model.js";
import base64 from "base-64";


// reister controllers-----------------------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await RegisterModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ status: "failure", message: "User Already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new RegisterModel({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ Status: "success", message: "Account created successfully." });
  } catch (err) {
    res.status(500).json({ status: "failed", message: "Account can't be created. Please try again later." });
  }
};

// login controllers---------------------------------------------------------

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await RegisterModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ status: "failure", message: "Please use registered email." });
    }

    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if (matchedPassword) {
      const token = base64.encode(`${email}:${password}`);
      res.status(200).json({ Status: "success", message: "Login successfully.", token });
    } else {
      res.status(400).json({ status: "failure", message: "Incorrect Password." });
    }
  } catch (err) {
    res.status(500).json({ Status: "Failure", message: "User cannot be authenticated at this time. Please try again later." });
  }
};
