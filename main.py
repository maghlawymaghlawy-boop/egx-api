from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

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
        
        # استدعاء البيانات المباشرة من واجهة مباشر مباشرة
        url = f"https://www.mubasher.info/api/1/stocks/search?query={symbol}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json'
        }
        
        res = requests.get(url, headers=headers, timeout=10).json()
        
        if res and isinstance(res, list) and len(res) > 0:
            stock_data = res[0]
            return {
                "status": "success",
                "symbol": symbol,
                "name": stock_data.get("name"),
                "price": stock_data.get("lastPrice"),
                "currency": stock_data.get("currency", "EGP"),
                "source": "Mubasher API"
            }
        else:
            return {"status": "error", "message": "السهم غير موجود"}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}
        
