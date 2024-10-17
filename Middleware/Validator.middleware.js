import bcrypt from "bcrypt";
import base64 from "base-64";
import RegisterModel from "../Models/Register.model.js";

const validator = async (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader) {
    return res
      .status(400)
      .json({ status: "failure", message: "User not logged in." });
  }

  const decodeAuthorization = base64.decode(authHeader);
  
  const [email, password] = decodeAuthorization.split(":");
 
  const user = await RegisterModel.findOne({ email });
  
  if (!user) {
    return res
      .status(401)
      .json({ status: "failure", message: "User not logged in." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (user && passwordMatch) {
    next();
  } else {
    return res
      .status(401)
      .json({ status: "failure", message: "User not logged in." });
  }
};

export default validator;
