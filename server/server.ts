import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./db";
import protectedRoutes from "./routes/protected";
import publicRoutes from "./routes/public";


const app = express();
const port = 3000;
const saltRounds = 10;

db.connect();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

publicRoutes(app, saltRounds);
protectedRoutes(app);

app.post("/logout", async (req: Request, res: Response) => {
  // could consider one query
  const sessionId = req.cookies.session_id;

  try {
     const result = await db.query("SELECT user_id FROM users WHERE session_id = $1", [sessionId])
     const userId = result.rows[0].user_id

     if (result.rows.length > 0) {
      await db.query("UPDATE users SET session_id = NULL WHERE user_id = $1", [userId]);
      res.clearCookie("session_id", { secure: true, httpOnly: true })
      res.json({ isSuccessfull: true, message: "Logged out successfully" });

     } else {
      res.status(400).json({ isSuccessfull: false, message: "Invalid session." });
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessfull: false, message: "Server error" });
  }
})

// chnage this to be proper, same as other middleware
app.post("/welcome", (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (Object.keys(cookie).length > 0) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


