import { mainPool } from '../config/database';

// --- Indian Data ---

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Isha', 'Priya', 'Kavya', 'Myra', 'Sara', 'Anika',
  'Rohan', 'Rahul', 'Amit', 'Raj', 'Vikram', 'Suresh', 'Deepak', 'Manoj', 'Karan', 'Nikhil',
  'Pooja', 'Neha', 'Sneha', 'Riya', 'Meera', 'Tanvi', 'Divya', 'Nisha', 'Sonia', 'Parul',
  'Harsh', 'Yash', 'Dev', 'Aryan', 'Kunal', 'Sahil', 'Varun', 'Gaurav', 'Siddharth', 'Pranav',
  'Shruti', 'Ankita', 'Swati', 'Pallavi', 'Komal', 'Richa', 'Mansi', 'Sakshi', 'Bhavna', 'Jyoti',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Joshi',
  'Mehta', 'Shah', 'Desai', 'Rao', 'Pillai', 'Menon', 'Chopra', 'Malhotra', 'Kapoor', 'Bhatia',
  'Agarwal', 'Bansal', 'Chauhan', 'Saxena', 'Mishra', 'Pandey', 'Tiwari', 'Srivastava', 'Yadav', 'Jain',
  'Das', 'Mukherjee', 'Chatterjee', 'Ghosh', 'Bose', 'Sen', 'Roy', 'Dutta', 'Patil', 'Kulkarni',
];

// Cities with their states — weighted toward metros for realism
const CITIES: Array<{ city: string; state: string; weight: number }> = [
  { city: 'Mumbai', state: 'Maharashtra', weight: 15 },
  { city: 'Delhi', state: 'Delhi', weight: 14 },
  { city: 'Bangalore', state: 'Karnataka', weight: 13 },
  { city: 'Hyderabad', state: 'Telangana', weight: 10 },
  { city: 'Chennai', state: 'Tamil Nadu', weight: 9 },
  { city: 'Kolkata', state: 'West Bengal', weight: 8 },
  { city: 'Pune', state: 'Maharashtra', weight: 7 },
  { city: 'Ahmedabad', state: 'Gujarat', weight: 5 },
  { city: 'Jaipur', state: 'Rajasthan', weight: 4 },
  { city: 'Lucknow', state: 'Uttar Pradesh', weight: 3 },
  { city: 'Chandigarh', state: 'Punjab', weight: 2 },
  { city: 'Kochi', state: 'Kerala', weight: 2 },
  { city: 'Indore', state: 'Madhya Pradesh', weight: 2 },
  { city: 'Bhopal', state: 'Madhya Pradesh', weight: 2 },
  { city: 'Nagpur', state: 'Maharashtra', weight: 2 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', weight: 2 },
];

// Products organized by category
const PRODUCTS: Array<{ name: string; category: string; price: number; stock: number }> = [
  // Electronics (10 products)
  { name: 'Wireless Bluetooth Earbuds', category: 'Electronics', price: 2499, stock: 150 },
  { name: 'Smart Watch Pro', category: 'Electronics', price: 4999, stock: 80 },
  { name: 'Portable Power Bank 20000mAh', category: 'Electronics', price: 1299, stock: 200 },
  { name: 'USB-C Fast Charger', category: 'Electronics', price: 899, stock: 300 },
  { name: 'Wireless Mouse', category: 'Electronics', price: 599, stock: 250 },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 3499, stock: 100 },
  { name: 'Webcam HD 1080p', category: 'Electronics', price: 1999, stock: 120 },
  { name: 'Bluetooth Speaker', category: 'Electronics', price: 1799, stock: 180 },
  { name: 'LED Desk Lamp', category: 'Electronics', price: 1199, stock: 160 },
  { name: 'Noise Cancelling Headphones', category: 'Electronics', price: 6999, stock: 60 },

  // Clothing (10 products)
  { name: 'Cotton Casual T-Shirt', category: 'Clothing', price: 499, stock: 500 },
  { name: 'Slim Fit Jeans', category: 'Clothing', price: 1299, stock: 300 },
  { name: 'Formal Button-Down Shirt', category: 'Clothing', price: 899, stock: 350 },
  { name: 'Running Shoes', category: 'Clothing', price: 2999, stock: 200 },
  { name: 'Winter Hoodie', category: 'Clothing', price: 1499, stock: 250 },
  { name: 'Cotton Kurta', category: 'Clothing', price: 799, stock: 400 },
  { name: 'Leather Belt', category: 'Clothing', price: 599, stock: 350 },
  { name: 'Aviator Sunglasses', category: 'Clothing', price: 1199, stock: 200 },
  { name: 'Sports Track Pants', category: 'Clothing', price: 699, stock: 300 },
  { name: 'Formal Blazer', category: 'Clothing', price: 3999, stock: 80 },

  // Home & Kitchen (10 products)
  { name: 'Stainless Steel Water Bottle', category: 'Home & Kitchen', price: 499, stock: 400 },
  { name: 'Non-Stick Frying Pan', category: 'Home & Kitchen', price: 899, stock: 250 },
  { name: 'Pressure Cooker 5L', category: 'Home & Kitchen', price: 1999, stock: 150 },
  { name: 'Mixer Grinder', category: 'Home & Kitchen', price: 2499, stock: 100 },
  { name: 'Bed Sheet Set (King Size)', category: 'Home & Kitchen', price: 1299, stock: 200 },
  { name: 'Ceramic Coffee Mugs (Set of 4)', category: 'Home & Kitchen', price: 699, stock: 300 },
  { name: 'Kitchen Storage Containers', category: 'Home & Kitchen', price: 599, stock: 350 },
  { name: 'Table Lamp', category: 'Home & Kitchen', price: 1499, stock: 120 },
  { name: 'Door Mat', category: 'Home & Kitchen', price: 299, stock: 500 },
  { name: 'Vacuum Cleaner', category: 'Home & Kitchen', price: 4999, stock: 70 },

  // Books (10 products)
  { name: 'The Psychology of Money', category: 'Books', price: 299, stock: 400 },
  { name: 'Atomic Habits', category: 'Books', price: 349, stock: 500 },
  { name: 'Rich Dad Poor Dad', category: 'Books', price: 250, stock: 450 },
  { name: 'Introduction to Algorithms (CLRS)', category: 'Books', price: 899, stock: 100 },
  { name: 'Clean Code', category: 'Books', price: 599, stock: 150 },
  { name: 'System Design Interview', category: 'Books', price: 499, stock: 200 },
  { name: 'The Alchemist', category: 'Books', price: 199, stock: 600 },
  { name: 'Sapiens', category: 'Books', price: 449, stock: 300 },
  { name: 'Deep Work', category: 'Books', price: 329, stock: 350 },
  { name: 'Wings of Fire', category: 'Books', price: 199, stock: 500 },

  // Sports & Fitness (10 products)
  { name: 'Yoga Mat', category: 'Sports & Fitness', price: 699, stock: 300 },
  { name: 'Resistance Bands Set', category: 'Sports & Fitness', price: 499, stock: 250 },
  { name: 'Skipping Rope', category: 'Sports & Fitness', price: 199, stock: 400 },
  { name: 'Dumbbell Set 10kg', category: 'Sports & Fitness', price: 1499, stock: 150 },
  { name: 'Cricket Bat (English Willow)', category: 'Sports & Fitness', price: 3999, stock: 50 },
  { name: 'Football (FIFA Approved)', category: 'Sports & Fitness', price: 999, stock: 200 },
  { name: 'Gym Gloves', category: 'Sports & Fitness', price: 399, stock: 300 },
  { name: 'Protein Shaker Bottle', category: 'Sports & Fitness', price: 299, stock: 350 },
  { name: 'Badminton Racket', category: 'Sports & Fitness', price: 1299, stock: 120 },
  { name: 'Foam Roller', category: 'Sports & Fitness', price: 599, stock: 200 },
];

const ORDER_STATUSES = ['completed', 'completed', 'completed', 'completed', 'shipped', 'processing', 'cancelled'];
// Weighted: 4/7 chance of "completed" — realistic

// --- Utility functions ---

/**
 * Pick a random element from an array.
 * 
 * TypeScript note: <T> is a GENERIC type parameter.
 * It means "this function works with arrays of ANY type
 * and returns that same type."
 * 
 * random(["a", "b"]) → returns string
 * random([1, 2, 3])  → returns number
 */
function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick a random city, weighted toward metros */
function randomCity(): { city: string; state: string } {
  // Create a weighted array: Mumbai appears 15 times, Delhi 14 times, etc.
  const weighted: Array<{ city: string; state: string }> = [];
  for (const c of CITIES) {
    for (let i = 0; i < c.weight; i++) {
      weighted.push({ city: c.city, state: c.state });
    }
  }
  return random(weighted);
}

/** Generate a random date within the past N months */
function randomDate(monthsBack: number): string {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsBack);
  
  const diff = now.getTime() - past.getTime();
  const randomTime = past.getTime() + Math.random() * diff;
  const date = new Date(randomTime);
  
  return date.toISOString().split('T')[0]; // "2024-08-15"
}

/** Generate a random integer between min and max (inclusive) */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Main seed function ---

async function seed(): Promise<void> {
  console.log('Seeding database with realistic Indian business data...\n');

  const client = await mainPool.connect();

  try {
    // Start a transaction — if anything fails, nothing gets inserted
    await client.query('BEGIN');

    // --- Clear existing data (in reverse order of dependencies) ---
    console.log('   Clearing existing data...');
    await client.query('TRUNCATE order_items, orders, products, customers RESTART IDENTITY CASCADE');

    // --- Insert Customers ---
    console.log('   Inserting 500 customers...');
    const customerValues: string[] = [];
    const customerParams: (string | null)[] = [];
    let paramIndex = 1;

    for (let i = 0; i < 500; i++) {
      const firstName = random(FIRST_NAMES);
      const lastName = random(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
      const location = randomCity();

      customerValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
      customerParams.push(name, email, location.city, location.state);
      paramIndex += 4;
    }

    await client.query(
      `INSERT INTO customers (name, email, city, state) VALUES ${customerValues.join(', ')}`,
      customerParams
    );

    // --- Insert Products ---
    console.log('   Inserting 50 products...');
    const productValues: string[] = [];
    const productParams: (string | number)[] = [];
    paramIndex = 1;

    for (const product of PRODUCTS) {
      productValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
      productParams.push(product.name, product.category, product.price, product.stock);
      paramIndex += 4;
    }

    await client.query(
      `INSERT INTO products (name, category, price, stock) VALUES ${productValues.join(', ')}`,
      productParams
    );

    // --- Insert Orders ---
    console.log('   Inserting 2,000 orders...');
    
    // Insert in batches of 500 to avoid parameter limit
    const BATCH_SIZE = 500;
    for (let batch = 0; batch < 4; batch++) {
      const orderValues: string[] = [];
      const orderParams: (string | number)[] = [];
      paramIndex = 1;

      for (let i = 0; i < BATCH_SIZE; i++) {
        const customerId = randomInt(1, 500);
        const orderDate = randomDate(12); // Past 12 months
        const status = random(ORDER_STATUSES);

        orderValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2})`);
        orderParams.push(customerId, orderDate, status);
        paramIndex += 3;
      }

      await client.query(
        `INSERT INTO orders (customer_id, order_date, status) VALUES ${orderValues.join(', ')}`,
        orderParams
      );
    }

    // --- Insert Order Items ---
    console.log('   Inserting 5,000 order items...');

    // Insert in batches of 1000
    for (let batch = 0; batch < 5; batch++) {
      const itemValues: string[] = [];
      const itemParams: (number)[] = [];
      paramIndex = 1;

      for (let i = 0; i < 1000; i++) {
        const orderId = randomInt(1, 2000);
        const productId = randomInt(1, 50);
        const quantity = randomInt(1, 5);
        // Look up the product price
        const product = PRODUCTS[productId - 1];
        const unitPrice = product.price;

        itemValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
        itemParams.push(orderId, productId, quantity, unitPrice);
        paramIndex += 4;
      }

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ${itemValues.join(', ')}`,
        itemParams
      );
    }

    // --- Update order totals ---
    console.log('   Calculating order totals...');
    await client.query(`
      UPDATE orders o
      SET total_amount = (
        SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0)
        FROM order_items oi
        WHERE oi.order_id = o.id
      )
    `);

    // Commit everything
    await client.query('COMMIT');

    // --- Print summary ---
    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM customers) as customers,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM orders) as orders,
        (SELECT COUNT(*) FROM order_items) as order_items
    `);

    const c = counts.rows[0];
    console.log('\nDatabase seeded successfully!');
    console.log(`Customers:   ${c.customers}`);
    console.log(`Products:    ${c.products}`);
    console.log(`Orders:      ${c.orders}`);
    console.log(`Order Items: ${c.order_items}`);
    console.log('\nYour database is ready for AI queries!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await mainPool.end();
  }
}

seed();
