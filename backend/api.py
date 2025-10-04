from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from helpers import updateUserPoints

# api setup
app = FastAPI(title="Coupon Hunt API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #firefox/chrome throws errors without this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ShoppingListRequest(BaseModel):
    hunt_id: str
    user_id: str

class HuntResult(BaseModel):
    hunt_id: str
    user_id: str
    points: int

@app.get("/")
def root():
    return {"status": "Coupon Hunt API is running!"}

# generate a shopping list for the upcoming coupon hunt
@app.get("/shoppinglist")
def getShoppingList(data: ShoppingListRequest):
    return {
        "status": "okay",
            "list": {
                "apple" : {
                 "brand": "GoldenApples",
                 "quantity": 2,
                 "price": 10.00
                },
                "banana" : {
                 "brand": "BrownBananas",
                 "quantity": 1,
                 "price": 7.50
                }
            }
    } 

# generate a shopping list for the upcoming coupon hunt
@app.post("/huntresult")
def getShoppingList(data: HuntResult):
    print(f"User {data.user_id} won {data.points} points")
    return {"status": "okay"}
