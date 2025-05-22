import { Express, Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface RegisterData {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

const publicRoutes = (app: Express, saltRounds: number) => {
  app.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (result.rows.length > 0) {
        const storedPassword = result.rows[0].password;

        bcrypt.compare(password, storedPassword, async (err, isMatch) => {
          if (err) {
            console.log(err);
            return;
          }

          if (isMatch) {
            const user = result.rows[0];
            const sessionId = crypto.randomUUID();

            await db.query("UPDATE users SET session_id = $1 WHERE user_id = $2", [sessionId, user.user_id]);

            res.cookie("session_id", sessionId, { secure: true, httpOnly: true });
            console.log("Success");

            res.json({ isAuthenticated: true });
          } else {
            res.json({ isAuthenticated: false, message: "Incorrect Password" });
          }
        });
      } else {
        res.json({ isAuthenticated: false, message: "Incorrect Username" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ isAuthenticated: false, message: "Server error" });
    }
  });

  app.post("/register", async (req: Request, res: Response) => {
    const { fName, lName, email, password }: RegisterData = req.body;

    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (checkResult.rows.length > 0) {
        res.json({ message: "User Already Exists, Log In" });
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.log("Error hashing password:", err);
            return;
          }

          const sessionId = crypto.randomUUID();

          const userData = await db.query(
            "INSERT INTO users (first_name, last_name, email, password, session_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [fName, lName, email, hash, sessionId]
          );
          console.log(userData)

          await db.query("INSERT INTO accounts (user_id, account_type) VALUES ($1, $2)", [userData.rows[0].user_id, "Jumpstart"])

          res.cookie("session_id", sessionId, { secure: true, httpOnly: true });
          res.json({ isAuthenticated: true });
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ isAuthenticated: false, message: "Server error" });
    }
  });
};

export default publicRoutes;
