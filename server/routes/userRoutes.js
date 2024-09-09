import express from 'express';
import { register, login, firebaseAuth, verify, getUsers, getUser, updateUser } from '../controllers/userControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import {verifyFirebaseToken} from '../middlewares/verifyFirebaseToken.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/auth/firebase', verifyFirebaseToken, firebaseAuth);

router.route("/auth/verify").get(isAuthenticated, verify);

router.route("/user").get(isAuthenticated, getUser);
router.route("/user/update").put(isAuthenticated, updateUser);

router.route("/users").get(getUsers);

export default router;
