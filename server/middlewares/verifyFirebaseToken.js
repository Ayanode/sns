import admin from "firebase-admin"
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});


const serviceAccounts = {
  type: process.env.TYPE || "",
  projectId: process.env.PROJECT_ID || "",
  privateKeyId: process.env.PRIVATE_KEY_ID || "",
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL || "",
  clientId: process.env.CLIENT_ID || "",
  authUri: process.env.AUTH_URI || "",
  tokenUri: process.env.TOKEN_URI || "",
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL || "",
  clientX509CertUrl: process.env.CLIENT_X509_CERT_URL || ""
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccounts)
});

export const  verifyFirebaseToken = async (req, res, next) => {
  const { token } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};



