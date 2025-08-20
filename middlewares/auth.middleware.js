import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({ message: "Unauthorized", error: error.message });
    }
};

export default authorize;