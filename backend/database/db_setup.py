# backend/database/db_setup.py

import sqlite3
import os

# Ensure the database folder exists
db_folder = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(db_folder, "mangrove_watch.db")

# Connect to SQLite database (creates file if it doesn't exist)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Enable foreign key support
cursor.execute("PRAGMA foreign_keys = ON;")

# --- Create tables ---

# Users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    total_reports INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Workflow results table
cursor.execute("""
CREATE TABLE IF NOT EXISTS workflow_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    confidence REAL,
    latitude REAL,
    longitude REAL,
    label TEXT,
    satellite_vegetation_change TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
""")

# Commit changes
conn.commit()

# --- Confirmation ---
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"Database initialized at: {db_path}")
print("Tables created:")
for table in tables:
    print(f" - {table[0]}")

# Close connection
conn.close()
