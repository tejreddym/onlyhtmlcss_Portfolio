import requests
import os

api_key = "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"
url = "https://api.groq.com/openai/v1/models"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

print(response.json())