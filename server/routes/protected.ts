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

        const accountResult = await db.query("SELECT account_id, account_type, balance, account_name, created_at FROM accounts WHERE user_id = $1", [userId])
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
        const { amount, transactionType, fromAccount, description} = req.body;
        try {
            const transactionResult = 
            await db.query(
                "INSERT INTO transactions (from_account_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4) RETURNING transaction_id",
                 [fromAccount, amount, transactionType, description]
                )
            const transactionId = transactionResult.rows[0].transaction_id;
            if (transactionType === "Payment") {
                const { title } = req.body;
                await db.query("INSERT INTO payment (transaction_id, title) VALUES ($1, $2)",[transactionId, title])
            } else if (transactionType === "Transfer") {
                const { toAccount } = req.body;
                await db.query("INSERT INTO transfer (transaction_id, to_account_id) VALUES ($1, $2)", [transactionId, toAccount])
            } else if (transactionType === "PayToPerson") {
                const { username } = req.body;
                await db.query("INSERT into paytoperson (transaction_id, username) VALUES ($1, $2)", [transactionId, username])
            } else {
                console.log("Unable To Insert Into Transfer Type Table")
            }

            res.json({ transactionId: transactionId, isSuccessfull: true });
        } catch (error) {
            console.log(error);
            res.json({ isSuccessfull: false });
        }
    })

    app.get("/transactionData", authMiddleware, async (req: CustomRequest, res: Response) => {
        const userId = req.user?.user_id;

    })

}

export default protectedRoutes;
