from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{ticker}")
def get_stock(ticker: str):
    try:
        symbol = ticker.upper().replace(".CA", "").strip()
        url = f"https://www.mubasher.info/markets/EGX/stocks/{symbol}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return {"status": "error", "message": "السهم غير موجود على مباشر"}

        soup = BeautifulSoup(response.text, 'html.parser')
        price_tag = soup.find('span', {'class': 'mi-market-pair-price'})
        
        if price_tag:
            return {
                "status": "success",
                "symbol": symbol,
                "price": price_tag.text.strip(),
                "currency": "EGP",
                "source": "Mubasher"
            }
        else:
            return {"status": "error", "message": "تعذر قراءة السعر"}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}
        
