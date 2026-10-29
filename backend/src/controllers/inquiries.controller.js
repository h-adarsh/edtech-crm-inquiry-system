import { query } from '../config/db.js';

/**
 * Create a new inquiry (Public endpoint)
 * Saves directly into PostgreSQL Supabase inquiries table using parameterized query.
 */
export const createInquiry = async (req, res, next) => {
  try {
    const { user_type, category, name, email, phone, message } = req.body;

    const sql = `
      INSERT INTO inquiries (user_type, category, name, email, phone, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING id, user_type, category, name, email, phone, message, status, created_at;
    `;

    const values = [
      user_type,
      category,
      name.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      message.trim(),
    ];

    const result = await query(sql, values);
    const newInquiry = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our team will contact you shortly.',
      data: newInquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List inquiries with multi-filter, search, and pagination (Admin protected)
 * Implements category filter, user_type filter, status filter, and name/phone search.
 * Strictly uses parameterized queries to guarantee defense against SQL injection.
 */
export const getInquiries = async (req, res, next) => {
  try {
    const {
      user_type,
      category,
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const params = [];

    // Filter by Category
    if (category && category !== 'All' && category !== '') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    // Filter by User Type
    if (user_type && user_type !== 'All' && user_type !== '') {
      params.push(user_type);
      conditions.push(`user_type = $${params.length}`);
    }

    // Filter by Status (Optional enhancement)
    if (status && status !== 'All' && status !== '') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    // Live search by Name or Phone (Case-insensitive ILIKE)
    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      conditions.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 1. Get total matching count for pagination
    const countSql = `SELECT COUNT(*) AS total FROM inquiries ${whereClause};`;
    const countResult = await query(countSql, params);
    const totalCount = parseInt(countResult.rows[0].total, 10);

    // 2. Fetch paginated records
    const dataParams = [...params];
    dataParams.push(parsedLimit);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const dataSql = `
      SELECT id, user_type, category, name, email, phone, message, status, created_at
      FROM inquiries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;

    const dataResult = await query(dataSql, dataParams);

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Inquiry Status (Admin protected)
 * Updates inquiry status to 'new', 'in_progress', or 'resolved'
 */
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sql = `
      UPDATE inquiries
      SET status = $1
      WHERE id = $2
      RETURNING id, user_type, category, name, email, phone, message, status, created_at;
    `;

    const result = await query(sql, [status, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found with the specified ID.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Inquiry status updated to '${status}'.`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

