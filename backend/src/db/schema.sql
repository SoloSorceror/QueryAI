-- ============================================
-- QueryAI Database Schema
-- ============================================
-- This script creates ALL tables needed for QueryAI.
-- It's idempotent (safe to run multiple times) because
-- of the IF NOT EXISTS clause.
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- APPLICATION TABLES
-- These store user accounts and query history
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS query_history (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question      TEXT NOT NULL,
    generated_sql TEXT NOT NULL,
    result        JSONB,
    insight       TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast history lookups by user
CREATE INDEX IF NOT EXISTS idx_query_history_user_id 
    ON query_history(user_id);

-- Index for sorting history by date
CREATE INDEX IF NOT EXISTS idx_query_history_created_at 
    ON query_history(created_at DESC);

-- ============================================
-- BUSINESS ANALYTICS TABLES
-- These simulate a real company's e-commerce data.
-- The AI will generate SQL queries against these.
-- ============================================

CREATE TABLE IF NOT EXISTS customers (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255),
    city       VARCHAR(100),
    state      VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    stock       INTEGER DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL PRIMARY KEY,
    customer_id  INTEGER NOT NULL REFERENCES customers(id),
    order_date   DATE NOT NULL,
    status       VARCHAR(50) DEFAULT 'completed',
    total_amount DECIMAL(12,2),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Indexes for common query patterns the AI will generate
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_customers_state ON customers(state);
