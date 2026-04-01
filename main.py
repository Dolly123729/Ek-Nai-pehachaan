import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Get the API key
api_key = os.environ.get("OPENAI_API_KEY")

# Test: print it
print("Your API key is:", api_key)