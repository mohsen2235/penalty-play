-- ساخت جدول کاربران
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50),
    balance DECIMAL(18, 6) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ساخت جدول تراکنش‌ها
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(18, 6) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('deposit', 'withdraw')),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')),
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ساخت جدول بازی‌ها
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER REFERENCES users(id),
    player2_id INTEGER REFERENCES users(id),
    winner_id INTEGER REFERENCES users(id),
    bet_amount DECIMAL(18, 6),
    status VARCHAR(20) CHECK (status IN ('waiting', 'ongoing', 'finished', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول چت‌های داخل بازی (اختیاری)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    user_id INTEGER REFERENCES users(id),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
