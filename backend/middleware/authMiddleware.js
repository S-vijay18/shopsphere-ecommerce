import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopsphere_super_secure_jwt_secret_key_2026_flipkart_style');
    
    // Check user in store or MySQL
    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [rows] = await pool.query('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?', [decoded.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
      }
      req.user = rows[0];
    } else {
      const store = db.getStore();
      const user = store.users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
      }
      const { password_hash, ...safeUser } = user;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
  }
};

