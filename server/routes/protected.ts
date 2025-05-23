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

    app.post("/accountData", authMiddleware, async (req: CustomRequest, res: Response) => {
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

}

export default protectedRoutes;
