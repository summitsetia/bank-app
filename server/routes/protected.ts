import { Express, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import db from "../db";

interface CustomRequest extends Request {
    user?: {
    user_id: string;
    [key: string]: any;
  };
}

const protectedRoutes = (app: Express) => {

    app.post("/authenticate", authMiddleware, async (req: CustomRequest, res: Response) => {
        if (req.user) {
            res.json({ isAuthenticated: true, user: req.user});
        }
    });

    // we already got req.user
    app.post("/userData", authMiddleware, async (req: CustomRequest, res: Response) => {
        const userId = req.user?.user_id;

        const accountResult = await db.query("SELECT account_type, balance, created_at FROM accounts WHERE user_id = $1", [userId])
        res.json({ userData:req.user, accountData: accountResult.rows, message: "Success"})
    })

    app.post("/accounts", authMiddleware, async (req: CustomRequest, res: Response) => {
    const userId = req.user?.user_id;
    const { accountType, balance } = req.body;

    try {
        await db.query(
            "INSERT INTO accounts (user_id, account_type, balance) VALUES ($1, $2, $3)",
            [userId, accountType, balance]
        );
        res.json({ isSuccessfull: true, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccessfull: false, message: "Database error" });
    }
    })

    app.post("/logout", authMiddleware, async (req: Request, res: Response) => {
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

}

export default protectedRoutes;
