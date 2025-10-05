-- New User Purchase History Table - One Row Per User with Purchases Array
-- Run this in Snowflake to create the restructured table

-- First, drop the old table if it exists
DROP TABLE IF EXISTS user_purchase_history;

-- Create the new consolidated table structure
CREATE TABLE user_purchase_history (
    user_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    purchases VARIANT NOT NULL DEFAULT '[]',
    total_purchases INTEGER DEFAULT 0,
    total_spent NUMBER(10,2) DEFAULT 0.00,
    total_points_earned INTEGER DEFAULT 0,
    first_purchase_date TIMESTAMP_NTZ,
    last_purchase_date TIMESTAMP_NTZ,
    last_updated TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)
COMMENT = 'Consolidated user purchase history - one row per user with all purchases in array';

-- Show the table structure
DESCRIBE TABLE user_purchase_history;
