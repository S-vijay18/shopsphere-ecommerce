import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { saveStoreToFile } from '../config/db.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'shopsphere_super_secure_jwt_secret_key_2026_flipkart_style',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const normalizedEmail = email.toLowerCase().trim();

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        [name.trim(), normalizedEmail, password_hash, phone || '', 'customer']
      );

      const userId = result.insertId;
      const token = generateToken(userId, 'customer');

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone || '',
          role: 'customer',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        }
      });
    } else {
      const store = db.getStore();
      const existing = store.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const newUserId = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newUserId,
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        phone: phone || '',
        role: 'customer',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        created_at: new Date().toISOString()
      };

      store.users.push(newUser);
      saveStoreToFile();

      const token = generateToken(newUserId, 'customer');
      const { password_hash: _, ...safeUser } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: safeUser
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.role);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar_url: user.avatar_url
        }
      });
    } else {
      const store = db.getStore();
      const user = store.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.role);
      const { password_hash, ...safeUser } = user;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: safeUser
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar_url } = req.body;
    const userId = req.user.id;

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      await pool.query(
        'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
        [name, phone, avatar_url, userId]
      );
      const [rows] = await pool.query('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?', [userId]);
      return res.status(200).json({ success: true, message: 'Profile updated successfully', user: rows[0] });
    } else {
      const store = db.getStore();
      const user = store.users.find(u => u.id === userId);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (avatar_url) user.avatar_url = avatar_url;
        saveStoreToFile();
        const { password_hash, ...safeUser } = user;
        return res.status(200).json({ success: true, message: 'Profile updated successfully', user: safeUser });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [userId]);
      return res.status(200).json({ success: true, addresses: rows });
    } else {
      const store = db.getStore();
      const userAddresses = (store.addresses || []).filter(a => a.user_id === userId);
      return res.status(200).json({ success: true, addresses: userAddresses });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, pincode, locality, address_line, city, state, landmark, alternate_phone, address_type, is_default } = req.body;

    if (!full_name || !phone || !pincode || !locality || !address_line || !city || !state) {
      return res.status(400).json({ success: false, message: 'Please provide all required address fields' });
    }

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      if (is_default) {
        await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
      }
      const [result] = await pool.query(
        `INSERT INTO addresses (user_id, full_name, phone, pincode, locality, address_line, city, state, landmark, alternate_phone, address_type, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, full_name, phone, pincode, locality, address_line, city, state, landmark || '', alternate_phone || '', address_type || 'Home', is_default ? 1 : 0]
      );
      const [newAddr] = await pool.query('SELECT * FROM addresses WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, message: 'Address added successfully', address: newAddr[0] });
    } else {
      const store = db.getStore();
      if (!store.addresses) store.addresses = [];
      if (is_default) {
        store.addresses.forEach(a => { if (a.user_id === userId) a.is_default = 0; });
      }
      const newId = store.addresses.length > 0 ? Math.max(...store.addresses.map(a => a.id)) + 1 : 1;
      const newAddress = {
        id: newId,
        user_id: userId,
        full_name,
        phone,
        pincode,
        locality,
        address_line,
        city,
        state,
        landmark: landmark || '',
        alternate_phone: alternate_phone || '',
        address_type: address_type || 'Home',
        is_default: is_default ? 1 : 0
      };
      store.addresses.push(newAddress);
      saveStoreToFile();
      return res.status(201).json({ success: true, message: 'Address added successfully', address: newAddress });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
      return res.status(200).json({ success: true, message: 'Address removed successfully' });
    } else {
      const store = db.getStore();
      store.addresses = (store.addresses || []).filter(a => !(a.id === addressId && a.user_id === userId));
      saveStoreToFile();
      return res.status(200).json({ success: true, message: 'Address removed successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing address' });
  }
};

