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
    app.get("/userData", authMiddleware, async (req: CustomRequest, res: Response) => {
        const userId = req.user?.user_id;

        const accountResult = await db.query("SELECT account_type, balance, account_name, created_at FROM accounts WHERE user_id = $1", [userId])
        res.json({ userData:req.user, accountData: accountResult.rows, message: "Success"})
    })

    app.post("/accounts", authMiddleware, async (req: CustomRequest, res: Response) => {
    const userId = req.user?.user_id;
    const { accountType, balance, accountName } = req.body;

    try {
        await db.query(
            "INSERT INTO accounts (user_id, account_type, balance, account_name) VALUES ($1, $2, $3, $4)",
            [userId, accountType, balance, accountName]
        );
        res.json({ isSuccessfull: true, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccessfull: false, message: "Database error" });
    }
    })

    app.post("/logout", authMiddleware, async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            await db.query("UPDATE users SET session_id = NULL WHERE user_id = $1", [userId]);
            res.clearCookie("session_id", { secure: true, httpOnly: true })
            res.json({ isSuccessfull: true, message: "Logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ isSuccessfull: false, message: "Server error" });
        }
    })

    app.post("/transactions", authMiddleware, async (req: CustomRequest, res: Response) => {
        const { amount, transactionType, description} = req.body;
        try {
            const userId = req.user?.user_id;
            await db.query("INSERT INTO transactions (from_account_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)")
        } catch (error) {
            console.log(error);
        }
    })

}

export default protectedRoutes;
