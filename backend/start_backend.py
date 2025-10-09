#!/usr/bin/env python3

import sys
import os

print("=" * 50)
print("MANGROVE WATCH BACKEND STARTUP")
print("=" * 50)

try:
    print("1. Setting up environment...")
    os.environ.setdefault('FLASK_ENV', 'development')
    print("   ✓ Environment configured")
    
    print("2. Importing Flask app...")
    from app import app
    print("   ✓ Flask app imported successfully")
    
    print("3. Starting Flask server...")
    print("   Server will be available at: http://127.0.0.1:5000")
    print("   Debug mode: ON")
    print("   CORS configured for frontend")
    print("=" * 50)
    print("BACKEND SERVER IS RUNNING!")
    print("=" * 50)
    
    app.run(host="127.0.0.1", port=5000, debug=True)
    
except Exception as e:
    print(f"   ✗ Error starting backend: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

