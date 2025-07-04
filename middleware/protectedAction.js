
// console.log("🔐 authenticate middleware triggered");


import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user; //  attached user to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed', error: err.message });
  }
};
