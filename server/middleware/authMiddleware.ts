import { Request, Response, NextFunction } from "express";
import db from "../db";

interface CustomRequest extends Request {
    user?: string;
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.session_id;

    try {
        const result = await db.query("SELECT * FROM users WHERE session_id = $1", [sessionId]);
        if (result.rows.length > 0) {
            req.user = result.rows[0];
            return next();
        } else {
            res.json({ isAuthenticated: false, message: "Session Id has Expired" });
        }
    } catch (error) {
        console.log(error);
        res.json({ isAuthenticated: false, message: "Session Id has Expired or Does not exist" });
    }

}

export default authMiddleware