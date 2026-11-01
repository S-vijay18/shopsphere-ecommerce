import db from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      let query = `
        SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (category) {
        if (!isNaN(category)) {
          query += ' AND p.category_id = ?';
          queryParams.push(parseInt(category));
        } else {
          query += ' AND c.slug = ?';
          queryParams.push(category);
        }
      }

      if (search) {
        query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (brand) {
        const brands = brand.split(',');
        query += ` AND p.brand IN (${brands.map(() => '?').join(',')})`;
        queryParams.push(...brands);
      }

      if (minPrice) {
        query += ' AND p.discounted_price >= ?';
        queryParams.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        query += ' AND p.discounted_price <= ?';
        queryParams.push(parseFloat(maxPrice));
      }

      if (rating) {
        query += ' AND p.rating >= ?';
        queryParams.push(parseFloat(rating));
      }

      if (discount) {
        query += ' AND p.discount_percent >= ?';
        queryParams.push(parseInt(discount));
      }

      // Sort
      if (sort === 'price_asc') {
        query += ' ORDER BY p.discounted_price ASC';
      } else if (sort === 'price_desc') {
        query += ' ORDER BY p.discounted_price DESC';
      } else if (sort === 'rating') {
        query += ' ORDER BY p.rating DESC';
      } else if (sort === 'newest') {
        query += ' ORDER BY p.created_at DESC';
      } else {
        // default popularity
        query += ' ORDER BY p.rating_count DESC, p.rating DESC';
      }

      // Execute full count
      const [allRows] = await pool.query(query, queryParams);
      const total = allRows.length;
      const totalPages = Math.ceil(total / limitNum);

      // Add Pagination
      const offset = (pageNum - 1) * limitNum;
      query += ' LIMIT ? OFFSET ?';
      queryParams.push(limitNum, offset);

      const [products] = await pool.query(query, queryParams);

      // Fetch images for each product
      for (const prod of products) {
        const [imgs] = await pool.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [prod.id]);
        prod.images = imgs.map(i => i.image_url);
        if (prod.images.length === 0 && prod.primary_image) {
          prod.images = [prod.primary_image];
        }
      }

      // Unique brands available
      const [brandRows] = await pool.query('SELECT DISTINCT brand FROM products ORDER BY brand ASC');
      const allBrands = brandRows.map(b => b.brand);

      return res.status(200).json({
        success: true,
        products,
        total,
        totalPages,
        currentPage: pageNum,
        brands: allBrands
      });
    } else {
      // High-performance embedded store mode
      const store = db.getStore();
      let list = [...store.products];

      if (category) {
        if (!isNaN(category)) {
          list = list.filter(p => p.category_id === parseInt(category));
        } else {
          const cat = store.categories.find(c => c.slug === category);
          if (cat) {
            list = list.filter(p => p.category_id === cat.id);
          }
        }
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      if (brand) {
        const brands = brand.split(',').map(b => b.trim().toLowerCase());
        list = list.filter(p => brands.includes(p.brand.toLowerCase()));
      }

      if (minPrice) {
        list = list.filter(p => p.discounted_price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        list = list.filter(p => p.discounted_price <= parseFloat(maxPrice));
      }

      if (rating) {
        list = list.filter(p => p.rating >= parseFloat(rating));
      }

      if (discount) {
        list = list.filter(p => p.discount_percent >= parseInt(discount));
      }

      // Sort
      if (sort === 'price_asc') {
        list.sort((a, b) => a.discounted_price - b.discounted_price);
      } else if (sort === 'price_desc') {
        list.sort((a, b) => b.discounted_price - a.discounted_price);
      } else if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        list.sort((a, b) => b.id - a.id);
      } else {
        // default popularity
        list.sort((a, b) => b.rating_count - a.rating_count);
      }

      const total = list.length;
      const totalPages = Math.ceil(total / limitNum);
      const offset = (pageNum - 1) * limitNum;
      const paginated = list.slice(offset, offset + limitNum).map(p => {
        const cat = store.categories.find(c => c.id === p.category_id);
        return {
          ...p,
          category_name: cat ? cat.name : '',
          category_slug: cat ? cat.slug : '',
          primary_image: p.images && p.images.length > 0 ? p.images[0] : ''
        };
      });

      const allBrands = Array.from(new Set(store.products.map(p => p.brand))).sort();

      return res.status(200).json({
        success: true,
        products: paginated,
        total,
        totalPages,
        currentPage: pageNum,
        brands: allBrands
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve products' });
  }
};

export const getProductBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (db.isMySQLActive()) {
      const pool = db.getPool();
      let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE ';
      const params = [];

      if (!isNaN(identifier)) {
        query += 'p.id = ?';
        params.push(parseInt(identifier));
      } else {
        query += 'p.slug = ?';
        params.push(identifier);
      }

      const [rows] = await pool.query(query, params);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const product = rows[0];
      const [images] = await pool.query('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [product.id]);
      product.images = images.map(i => i.image_url);

      // Reviews
      const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [product.id]);
      product.reviews = reviews;

      // Related products
      const [related] = await pool.query(`
        SELECT p.*, (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
        FROM products p
        WHERE p.category_id = ? AND p.id != ?
        LIMIT 6
      `, [product.category_id, product.id]);

      return res.status(200).json({
        success: true,
        product,
        related
      });
    } else {
      const store = db.getStore();
      const product = store.products.find(p =>
        (!isNaN(identifier) && p.id === parseInt(identifier)) ||
        p.slug === identifier
      );

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const cat = store.categories.find(c => c.id === product.category_id);
      const reviews = (store.reviews || []).filter(r => r.product_id === product.id);
      const related = store.products
        .filter(p => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 6)
        .map(p => ({
          ...p,
          primary_image: p.images && p.images.length > 0 ? p.images[0] : ''
        }));

      return res.status(200).json({
        success: true,
        product: {
          ...product,
          category_name: cat ? cat.name : '',
          category_slug: cat ? cat.slug : '',
          primary_image: product.images && product.images.length > 0 ? product.images[0] : '',
          reviews
        },
        related
      });
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve product details' });
  }
};

export const getHomepageSections = async (req, res) => {
  try {
    const store = db.getStore();

    // Map helper to format product
    const formatProduct = (p) => {
      const cat = store.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : '',
        category_slug: cat ? cat.slug : '',
        primary_image: p.images && p.images.length > 0 ? p.images[0] : ''
      };
    };

    // 1. Popular Picks: Specifically the 4 promotional cards from reference screenshot:
    // - Milton Bottles – From ₹129
    // - Comfortable Shoes – From ₹199
    // - Watches – From ₹99
    // - Best Deals – Under ₹469
    const popularPicks = store.products
      .filter(p => p.is_popular_pick)
      .slice(0, 4)
      .map(formatProduct);

    // 2. In The Spotlight
    const spotlight = store.products
      .filter(p => p.is_spotlight)
      .map(formatProduct);

    // 3. Best Deals of the Day
    const dealsOfDay = store.products
      .filter(p => p.is_deal_of_the_day)
      .map(formatProduct);

    // 4. Trending Products
    const trending = store.products
      .filter(p => p.is_trending)
      .map(formatProduct);

    // 5. Top Fashion Deals (Category 2)
    const topFashion = store.products
      .filter(p => p.category_id === 2)
      .map(formatProduct);

    // 6. Best Electronics (Category 3 & 4)
    const bestElectronics = store.products
      .filter(p => p.category_id === 3 || p.category_id === 4)
      .map(formatProduct);

    // 7. Home & Kitchen Essentials (Category 6 & 7)
    const homeKitchen = store.products
      .filter(p => p.category_id === 6 || p.category_id === 7)
      .map(formatProduct);

    // 8. Recommended For You
    const recommended = store.products
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, 8)
      .map(formatProduct);

    res.status(200).json({
      success: true,
      sections: {
        popularPicks,
        spotlight,
        dealsOfDay,
        trending,
        topFashion,
        bestElectronics,
        homeKitchen,
        recommended
      }
    });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve homepage sections' });
  }
};

export const checkPincode = async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        deliverable: false,
        message: 'Please enter a valid 6-digit PIN code'
      });
    }

    // Determine estimated delivery date (2 to 3 days from today)
    const deliveryDays = parseInt(pincode[pincode.length - 1]) % 2 === 0 ? 2 : 3;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateFormatted = estDate.toLocaleDateString('en-IN', options);

    return res.status(200).json({
      success: true,
      deliverable: true,
      pincode,
      estimatedDeliveryDate: dateFormatted,
      daysToDeliver: deliveryDays,
      deliveryCharge: 0,
      codAvailable: true,
      message: `Delivery by ${dateFormatted} | FREE`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking pincode' });
  }
};

