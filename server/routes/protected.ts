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
        res.json({ isSuccessful: true, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isSuccessful: false, message: "Database error" });
    }
    })

    app.post("/logout", authMiddleware, async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            await db.query("UPDATE users SET session_id = NULL WHERE user_id = $1", [userId]);
            res.clearCookie("session_id", { secure: true, httpOnly: true })
            res.json({ isSuccessful: true, message: "Logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ isSuccessful: false, message: "Server error" });
        }
    })

    app.post("/transactions", authMiddleware, async (req: CustomRequest, res: Response) => {
        const userId = req.user?.user_id;
        const { amount, transactionType, fromAccount, description} = req.body;
        try {
            const transactionResult = 
            await db.query(
                "INSERT INTO transactions (user_id, from_account_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4, $5) RETURNING transaction_id",
                 [userId, fromAccount, amount, transactionType, description]
                )
            const transactionId = transactionResult.rows[0].transaction_id;
            await db.query("UPDATE accounts SET balance = balance - $1 WHERE account_id = $2", [Number(amount), fromAccount])
            if (transactionType === "Payment") {
                const { title } = req.body;
                await db.query("INSERT INTO payment (transaction_id, payee) VALUES ($1, $2)",[transactionId, title])
            } else if (transactionType === "Transfer") {
                const { toAccount } = req.body;
                await db.query("INSERT INTO transfer (transaction_id, to_account_id) VALUES ($1, $2)", [transactionId, toAccount])
                 await db.query("UPDATE accounts SET balance = balance + $1 WHERE account_id = $2", [Number(amount), toAccount])
            } else if (transactionType === "PayToPerson") {
                const { username } = req.body;
                await db.query("INSERT into paytoperson (transaction_id, username) VALUES ($1, $2)", [transactionId, username])
                const result = await db.query("SELECT user_id FROM users WHERE username = $1", [username])
                const toPayId = result.rows[0].user_id;
                await db.query("UPDATE accounts SET balance = balance + $1 WHERE user_id = $2 AND account_name = $3", [Number(amount), toPayId, "Initial Account"])
                await db.query("INSERT INTO income (user_id, transaction_id, amount, transaction_type) VALUES ($1, $2, $3, $4)", [toPayId, transactionId, amount, "Income"])
            } else {
                console.log("Unable To Insert Into Transfer Type Table")
            }

            res.json({ transactionId: transactionId, isSuccessful: true });
        } catch (error) {
            console.log(error);
            res.json({ isSuccessful: false });
        }
    })

    app.get("/transactionData", authMiddleware, async (req: CustomRequest, res: Response) => {
        const userId = req.user?.user_id;

        try {
            const paymentResult = await db.query(
                `SELECT transactions.transaction_type, transactions.amount, transactions.from_account_id, 
                        transactions.description, transactions.created_at, payment.payee
                FROM transactions
                LEFT JOIN payment ON transactions.transaction_id = payment.transaction_id
                WHERE transactions.user_id = $1 AND transactions.transaction_type = 'Payment'`, 
                [userId]
            );

            const transferResult = await db.query(
                `SELECT transactions.transaction_type, transactions.amount, transactions.from_account_id, 
                        transactions.description, transactions.created_at, transfer.to_account_id
                FROM transactions
                LEFT JOIN transfer ON transactions.transaction_id = transfer.transaction_id
                WHERE transactions.user_id = $1 AND transactions.transaction_type = 'Transfer'`, 
                [userId]
            );

            const payToPersonResult = await db.query(
                `SELECT transactions.transaction_type, transactions.amount, transactions.from_account_id, 
                        transactions.description, transactions.created_at, paytoperson.username
                FROM transactions
                LEFT JOIN paytoperson ON transactions.transaction_id = paytoperson.transaction_id
                WHERE transactions.user_id = $1 AND transactions.transaction_type = 'PayToPerson'`, 
                [userId]
            );

            const incomeResult = await db.query(
                `SELECT income.income_id, income.user_id, income.transaction_id, income.amount, income.transaction_type, income.created_at, 
                        transactions.description, transactions.from_account_id
                FROM income
                JOIN transactions ON income.transaction_id = transactions.transaction_id
                WHERE income.user_id = $1`,
                [userId]
            );

            const allData = [
                ...paymentResult.rows,
                ...transferResult.rows,
                ...payToPersonResult.rows,
                ...incomeResult.rows
            ];

            res.json({ allData, isSuccessful: true });

        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.json({ isSuccessful: false });
        }
    })

}

export default protectedRoutes;
