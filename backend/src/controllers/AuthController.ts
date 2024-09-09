import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../model/user";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ msg: "Please enter mandatory fields" });
      return;
    }
    User.findOne({ email }).then((user) => {
      if (user) return res.status(400).json({ msg: "User already exists" });
      const newUser = new User({
        name,
        email,
        password,
        phone,
        state: 0
      });
      //-- create salt and hash
      bcrypt.genSalt(10, (err, salt: string) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET!,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user
                });
              }
            );
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Signup error" });
  }
};

export const login = (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Please type in all the data" });
    return;
  }
  User.findOne({ email }).then((user) => {
    if (!user || user == null) {
      res.status(400).json({ msg: "Invalid email or password" });
      return;
    }
    bcrypt.compare(password, user!.password).then((isMatch: Boolean) => {
      if (isMatch)
        jwt.sign(
          { id: user!._id },
          process.env.JWT_SECRET!,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                state: user?.state
              }
            });
          }
        );
      else res.status(403).json({ msg: "Invalid Password" });
    });
  });
};

export const changeInfo = (req: Request, res: Response) => {
  const { fname, lname, email, phone, password, passwordConfirm } = req.body;
  console.log(email);
  if (!email || !fname || !lname || !phone || !password || !passwordConfirm) {
    res.status(400).json({ msg: "Please type in all the data" });
    return;
  }
  User.findOne({ email }).then((user) => {
    console.log(user);
    if (!user || user == null) {
      res.status(400).json({ msg: "Invalid email or password" });
      return;
    }
    if (password !== passwordConfirm) {
      res.status(400).json({ msg: "Confirm Password is not same" });
      return;
    }
    if (password) {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => {
          const updatedUser = User.findByIdAndUpdate(user.id, {
            $set: { email, password: hash, phone, name: fname + lname }
          }).then(() => {
            res.status(200).json({ msg: "Operation Successful" });
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ msg: "Password hashing error" });
        });
    }
  });
};

export const get_user = (req: Request, res: Response) => {
  User.findById(req.body.id)
    .select("-password")
    .then((user) => res.json(user));
};
