-- New table structure: One row per user with purchases as an array
-- Run this in Snowflake to create the new structure

DROP TABLE IF EXISTS user_purchase_history;

CREATE OR REPLACE TABLE user_purchase_history (
    user_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    total_purchases INTEGER DEFAULT 0,
    total_spent NUMBER(10,2) DEFAULT 0.00,
    total_points_earned INTEGER DEFAULT 0,
    purchases VARIANT NOT NULL DEFAULT '[]', -- Array of all purchases
    last_updated TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)
COMMENT = 'User purchase history with all purchases stored as array per user';

-- Alternative: Keep existing users table separate and just modify purchase tracking
-- CREATE OR REPLACE TABLE user_consolidated_purchases (
--     user_id VARCHAR(50) PRIMARY KEY,
--     purchases VARIANT NOT NULL DEFAULT '[]',
--     total_purchases INTEGER DEFAULT 0,
--     total_spent NUMBER(10,2) DEFAULT 0.00,
--     total_points_earned INTEGER DEFAULT 0,
--     last_updated TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- ) COMMENT = 'Consolidated purchase history - one row per user';
