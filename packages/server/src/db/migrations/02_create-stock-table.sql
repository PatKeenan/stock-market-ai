CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    exchange TEXT NOT NULL,
    UNIQUE (symbol, exchange)
);
