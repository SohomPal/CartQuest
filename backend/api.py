# run with uvicorn main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from helpers import updateUserPoints
import json

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

@app.get("/points/{user}")
def getPoints(user: str):
    return 1200

# generate a shopping list for the upcoming coupon hunt
@app.post("/shoppinglist")
def getShoppingList(data: ShoppingListRequest):
    
    # first, query snowflake for the last xyz purchases or typical purchases from this date
    # generate a probability distribution of most likely purchases on today's date
    # use parameter to randomly include additional/sponsored items in the specified supermarket
    # return list of N items and their product information
    
    with open("mock_challenges.json") as f:
        challenges = json.load(f)
    
    challenge = next((c for c in challenges if c["id"] == data.hunt_id), None)
    if not challenge:
        return {"status": "error", "message": "Challenge not found"}
    
    # Optionally customize per user
    return {"status": "okay", "challenge": challenge}

# generate a shopping list for the upcoming coupon hunt
@app.post("/huntresult")
def getShoppingList(data: HuntResult):
    # update user profile with data
    print(f"User {data.user_id} won {data.points} points")
    return {"status": "okay"}
