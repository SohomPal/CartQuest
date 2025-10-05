-- CouponHunt Database Tables Creation Script
-- Run this in your Snowflake worksheet after setting up your warehouse and database

-- Use the correct context
USE WAREHOUSE COUPONHUNT_WH;
USE DATABASE COUPONHUNT_DB;
USE SCHEMA DEV;

-- Create users table
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
)
COMMENT = 'User profiles and account information for CouponHunt app';

-- Create user_purchase_history table
CREATE TABLE user_purchase_history (
    purchase_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    store_location VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    items VARIANT NOT NULL,
    purchase_date TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    points_earned INTEGER DEFAULT 0,
    hunt_id VARCHAR(50),
    receipt_image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'COMPLETED',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)
COMMENT = 'Complete purchase history for users including coupon hunt transactions';

-- Create coupon_hunts table (for tracking active challenges)
CREATE TABLE coupon_hunts (
    hunt_id VARCHAR(50) PRIMARY KEY,
    hunt_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP_NTZ NOT NULL,
    end_date TIMESTAMP_NTZ NOT NULL,
    target_items VARIANT NOT NULL,
    points_reward INTEGER NOT NULL,
    store_location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
)
COMMENT = 'Active and historical coupon hunt challenges';

-- Create user_hunt_participation table (for tracking user participation)
CREATE TABLE user_hunt_participation (
    participation_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    hunt_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    items_found VARIANT,
    completion_date TIMESTAMP_NTZ,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (hunt_id) REFERENCES coupon_hunts(hunt_id)
)
COMMENT = 'Tracks user participation in specific coupon hunts';

-- Create indexes for better performance
CREATE INDEX idx_user_purchase_history_user_id ON user_purchase_history(user_id);
CREATE INDEX idx_user_purchase_history_date ON user_purchase_history(purchase_date);
CREATE INDEX idx_user_hunt_participation_user_id ON user_hunt_participation(user_id);
CREATE INDEX idx_user_hunt_participation_hunt_id ON user_hunt_participation(hunt_id);

-- Grant permissions (optional, adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA DEV TO ROLE DEVELOPER;
