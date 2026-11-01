import db from '../config/db.js';

export const getCategories = async (req, res) => {
  try {
    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY display_order ASC, id ASC');
      return res.status(200).json({ success: true, categories: rows });
    } else {
      const store = db.getStore();
      const sorted = [...store.categories].sort((a, b) => a.display_order - b.display_order);
      return res.status(200).json({ success: true, categories: sorted });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (db.isMySQLActive()) {
      const pool = db.getPool();
      const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.status(200).json({ success: true, category: rows[0] });
    } else {
      const store = db.getStore();
      const cat = store.categories.find(c => c.slug === slug);
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.status(200).json({ success: true, category: cat });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category details' });
  }
};

