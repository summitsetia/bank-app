import { Express, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
// import db from "../db";

interface CustomRequest extends Request {
    user?: string;
}

const protectedRoutes = (app: Express) => {

    app.post("/authenticate", authMiddleware, async (req: CustomRequest, res: Response) => {
        if (req.user) {
            res.json({ isAuthenticated: true, user: req.user});
        }
    });

}

export default protectedRoutes;
