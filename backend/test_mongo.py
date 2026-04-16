
import os
import pymongo
import certifi
import ssl
import urllib.request
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

print(f"Python SSL version: {ssl.OPENSSL_VERSION}")

# Test generic SSL connectivity
try:
    print("Testing generic SSL connectivity (https://google.com)...")
    with urllib.request.urlopen("https://google.com", timeout=5, context=ssl.create_default_context(cafile=certifi.where())) as response:
        print(f"SUCCESS: Connected to Google (Status: {response.getcode()})")
except Exception as e:
    print(f"FAILURE: Could not connect to Google (General SSL Issue).\nError: {e}")

print(f"\nTesting connection to MongoDB Atlas: {MONGODB_URL.split('@')[-1] if '@' in MONGODB_URL else MONGODB_URL}")

try:
    client = pymongo.MongoClient(
        MONGODB_URL,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000
    )
    # Force a connection
    client.admin.command('ping')
    print("SUCCESS: Connected to MongoDB Atlas!")
except Exception as e:
    print(f"FAILURE: Could not connect to MongoDB Atlas.\nError: {e}")
