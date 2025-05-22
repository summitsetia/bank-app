import { Express, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import db from "../db";

interface CustomRequest extends Request {
    user?: string;
}

const protectedRoutes = (app: Express) => {

    app.post("/authenticate", authMiddleware, async (req: CustomRequest, res: Response) => {
        if (req.user) {
            res.json({ isAuthenticated: true, user: req.user});
        }
    });

    app.post("/userData", authMiddleware, async (req: CustomRequest, res: Response) => {
        const sessionId = req.cookies.session_id;
        const userResult = await db.query("SELECT user_id, first_name, last_name, email FROM users WHERE session_id = $1",[sessionId]);

        if (userResult.rows.length > 0) {
            const accountResult = await db.query("SELECT account_type, balance, created_at FROM accounts WHERE user_id = $1", [userResult.rows[0].user_id])
            res.json({ userData: userResult.rows[0], accountData: accountResult.rows, message: "Success"})
        } else {
            res.json({ message: "User Not Found"})
        }
    })

}

export default protectedRoutes;
