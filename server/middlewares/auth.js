import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Create Token
export const createToken = (userID, email) => {
    const token = jwt.sign(
        {
            userID, email
        }, process.env.SECRET_KEY,
        {
            expiresIn: '5d'
        }
    );

    return token;
};

// Check is Authenticated
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                isLogin: false,
                message: "Missing Token"
            });
        }

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    isLogin: false,
                    message: err.message
                });
            }

            try {
                const user = await User.findById(decoded.userID).select('-password'); 

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        isLogin: false,
                        message: "User not found"
                    });
                }

                req.user = user;
                next();
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Check is Admin
export const isAdminUser = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                isLogin: false,
                message: "Admin not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
