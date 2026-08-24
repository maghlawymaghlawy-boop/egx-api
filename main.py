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
    symbol = f"{ticker.upper()}.CA"
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=5d"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        res = requests.get(url, headers=headers).json()
        result = res['chart']['result'][0]
        meta = result['meta']
        
        current_price = round(meta['regularMarketPrice'], 2)
        prev_close = round(meta['chartPreviousClose'], 2)
        
        margin = round(current_price * 0.012, 2)
        min_price = round(current_price - margin, 2)
        max_price = round(current_price + margin, 2)
        
        if current_price > prev_close:
            rec = "شراء (اتجاه صاعد)"
        elif current_price < prev_close:
            rec = "بيع / حذر (اتجاه هابط)"
        else:
            rec = "احتفاظ (تذبذب عرضي)"

        return {
            "status": "success",
            "symbol": ticker.upper(),
            "price": current_price,
            "currency": "EGP",
            "min_price": min_price,
            "max_price": max_price,
            "recommendation": rec
        }
    except Exception as e:
        return {"status": "error", "message": "تعذر سحب السهم"}
