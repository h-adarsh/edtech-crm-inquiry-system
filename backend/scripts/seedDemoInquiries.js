import { pool, query } from '../src/config/db.js';

const DEMO_INQUIRIES = [
  {
    user_type: 'Parent',
    category: 'Scholarship',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    message: 'Inquiring about 10th grade merit scholarship criteria and application deadlines.',
    status: 'in_progress',
  },
  {
    user_type: 'Student',
    category: 'Admission',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    message: 'Interested in applying for the 11th grade Computer Science stream.',
    status: 'resolved',
  },
  {
    user_type: 'School',
    category: 'Concert',
    name: 'St. Xavier Academy',
    email: 'principal@stxaviers.edu.in',
    phone: '+91 94455 66778',
    message: 'Requesting sponsorship and partnership details for our annual inter-school cultural concert.',
    status: 'new',
  },
  {
    user_type: 'Parent',
    category: 'Admission',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    phone: '+91 98888 12345',
    message: 'Looking for Grade 6 admission brochure and fee breakdown structure.',
    status: 'new',
  },
  {
    user_type: 'Student',
    category: 'Scholarship',
    name: 'Arjun Verma',
    email: 'arjun.v2008@outlook.com',
    phone: '+91 97777 65432',
    message: 'Seeking financial aid information for the STEM excellence coaching track.',
    status: 'in_progress',
  },
  {
    user_type: 'School',
    category: 'General Query',
    name: 'Delhi Public High School',
    email: 'admin@dphsdelhi.org',
    phone: '+91 91122 33445',
    message: 'Inquiring about bulk student enrollment and teacher training workshops.',
    status: 'new',
  },
  {
    user_type: 'Parent',
    category: 'General Query',
    name: 'Sunita Kulkarni',
    email: 'sunita.k@yahoo.com',
    phone: '+91 93344 55667',
    message: 'Want to know if school transport bus routes cover the Whitefield area.',
    status: 'resolved',
  },
  {
    user_type: 'Student',
    category: 'Concert',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@student.edu',
    phone: '+91 96655 44332',
    message: 'Audition registration query for the upcoming winter music and arts festival.',
    status: 'new',
  },
];

async function seedDemoInquiries() {
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error('SAFETY WARNING: Refusing to truncate inquiries in production without --force.');
    process.exit(1);
  }

  console.log('Seeding demo inquiries into Supabase...');
  try {
    // Truncate existing inquiries for clean slate demonstration in development
    await query('TRUNCATE TABLE inquiries CASCADE');

    for (const item of DEMO_INQUIRIES) {
      const sql = `
        INSERT INTO inquiries (user_type, category, name, email, phone, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await query(sql, [
        item.user_type,
        item.category,
        item.name,
        item.email,
        item.phone,
        item.message,
        item.status,
      ]);
    }

    const countRes = await query('SELECT count(*) FROM inquiries');
    console.log(`Successfully seeded ${countRes.rows[0].count} demo inquiries covering all categories and user types!`);
  } catch (error) {
    console.error('Error seeding demo inquiries:', error.message);
  } finally {
    await pool.end();
  }
}

seedDemoInquiries();

