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

// // chnage this to be proper, same as other middleware
// app.post("/welcome", (req: Request, res: Response) => {
//   const cookie = req.cookies;
//   if (Object.keys(cookie).length > 0) {
//     res.json({ isAuthenticated: true });
//   } else {
//     res.json({ isAuthenticated: false });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


