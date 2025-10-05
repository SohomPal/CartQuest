from typing import List, Optional, Dict, Tuple
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from datetime import datetime
import math
import random

PROMO_DEFAULT = 0

app = FastAPI(title="Coupon Hunt API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class CartItem(BaseModel):
    id: str
    name: str
    category: str
    location: str
    points: int
    price: float
    isPromo: Optional[bool] = None
class ChallengeItemModel(BaseModel):
    id: str
    name: str
    category: str
    location: str
    points: int
    price: float
    isPromo: Optional[bool] = None
    barcode: Optional[str] = None
    scanned: Optional[bool] = None

class ChallengeModel(BaseModel):
    id: str
    title: str
    description: str
    points: int
    timeRemaining: str
    color: str
    items: List[ChallengeItemModel]
    currentPoints: Optional[int] = None
    completed: Optional[bool] = None

CATALOG: Dict[str, ChallengeItemModel] = {}
def ingest_challenges_into_catalog(challs: List[ChallengeModel]):
    for ch in challs:
        for it in ch.items:
            CATALOG[it.id] = it

food_items: List[ChallengeModel] = [
    ChallengeModel(
        id="4",
        title="Health & Wellness",
        description="Pick up vitamins and supplements",
        points=300,
        timeRemaining="3h 00m",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        items=[
            # existing
            ChallengeItemModel(id="13", name="Multivitamins", category="Health", location="Aisle 10, Left", points=100, price=15.99),
            ChallengeItemModel(id="14", name="Protein Powder", category="Health", location="Aisle 10, Center", points=120, price=29.99, isPromo=True),
            ChallengeItemModel(id="15", name="Greek Yogurt", category="Dairy", location="Aisle 3, Center", points=80, price=5.99),

            # new (Health/Dairy only)
            ChallengeItemModel(id="26", name="Vitamin D3 2000 IU", category="Health", location="Aisle 10, Left", points=90, price=8.99, isPromo=True),
            ChallengeItemModel(id="27", name="Omega-3 Fish Oil", category="Health", location="Aisle 10, Left", points=110, price=12.49),
            ChallengeItemModel(id="28", name="Probiotic Capsules", category="Health", location="Aisle 10, Center", points=120, price=17.99),
            ChallengeItemModel(id="29", name="Electrolyte Drink Mix", category="Health", location="Aisle 10, Right", points=70, price=9.49),
            ChallengeItemModel(id="30", name="Almond Milk (Unsweetened)", category="Dairy", location="Aisle 3, Left", points=75, price=3.79),
            ChallengeItemModel(id="31", name="Kefir (Plain)", category="Dairy", location="Aisle 3, Right", points=85, price=4.99, isPromo=True),
            ChallengeItemModel(id="32", name="Whey Isolate", category="Health", location="Aisle 10, Center", points=130, price=34.99),
            ChallengeItemModel(id="33", name="Collagen Peptides", category="Health", location="Aisle 10, Right", points=120, price=22.99),
            ChallengeItemModel(id="34", name="Herbal Tea (Chamomile)", category="Health", location="Aisle 10, Endcap", points=60, price=3.49),
            ChallengeItemModel(id="35", name="Hand Sanitizer (Travel)", category="Health", location="Aisle 10, Front", points=50, price=2.49),
            ChallengeItemModel(id="36", name="First Aid Kit (Small)", category="Health", location="Aisle 10, Back", points=140, price=14.99),
            ChallengeItemModel(id="37", name="Flexible Bandages", category="Health", location="Aisle 10, Back", points=55, price=3.29),
            ChallengeItemModel(id="38", name="Digital Thermometer", category="Health", location="Aisle 10, Back", points=150, price=9.99, isPromo=True),
            ChallengeItemModel(id="39", name="Low-Fat Milk (1%)", category="Dairy", location="Aisle 3, Left", points=70, price=2.99),
            ChallengeItemModel(id="40", name="Cottage Cheese", category="Dairy", location="Aisle 3, Center", points=80, price=3.59),
        ],
    ),
    ChallengeModel(
        id="5",
        title="Weekend BBQ",
        description="Everything you need for a backyard BBQ",
        points=750,
        timeRemaining="6h 30m",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        items=[
            # existing
            ChallengeItemModel(id="16", name="Ground Beef", category="Meat", location="Aisle 1, Back", points=150, price=9.99, isPromo=True),
            ChallengeItemModel(id="17", name="Hot Dog Buns", category="Bakery", location="Aisle 7, Left", points=80, price=2.99),
            ChallengeItemModel(id="18", name="BBQ Sauce", category="Condiments", location="Aisle 4, Center", points=100, price=4.99),
            ChallengeItemModel(id="19", name="Lettuce", category="Produce", location="Front Section", points=120, price=2.49),
            ChallengeItemModel(id="20", name="Tomatoes", category="Produce", location="Front Section", points=120, price=3.99),
            ChallengeItemModel(id="21", name="Cheese Slices", category="Dairy", location="Aisle 3, Right", points=180, price=5.99, isPromo=True),

            # new (Meat/Bakery/Condiments/Produce/Dairy only)
            ChallengeItemModel(id="41", name="Italian Sausage Links", category="Meat", location="Aisle 1, Back", points=140, price=8.49),
            ChallengeItemModel(id="42", name="Chicken Thighs (Bone-in)", category="Meat", location="Aisle 1, Back", points=130, price=6.99, isPromo=True),
            ChallengeItemModel(id="43", name="Brioche Burger Buns", category="Bakery", location="Aisle 7, Right", points=95, price=3.99),
            ChallengeItemModel(id="44", name="Sesame Hamburger Buns", category="Bakery", location="Aisle 7, Right", points=85, price=2.79),
            ChallengeItemModel(id="45", name="Ketchup (Squeeze)", category="Condiments", location="Aisle 4, Left", points=70, price=2.49),
            ChallengeItemModel(id="46", name="Yellow Mustard", category="Condiments", location="Aisle 4, Left", points=60, price=1.69),
            ChallengeItemModel(id="47", name="Dill Pickle Spears", category="Condiments", location="Aisle 4, Right", points=80, price=3.49),
            ChallengeItemModel(id="48", name="Relish", category="Condiments", location="Aisle 4, Right", points=60, price=1.99),
            ChallengeItemModel(id="49", name="Corn on the Cob (4 ct)", category="Produce", location="Front Section", points=110, price=3.99, isPromo=True),
            ChallengeItemModel(id="50", name="Portobello Mushrooms (2 ct)", category="Produce", location="Front Section", points=100, price=4.49),
            ChallengeItemModel(id="51", name="Red Onions (2 lb)", category="Produce", location="Front Section", points=90, price=2.29),
            ChallengeItemModel(id="52", name="Watermelon (Quarter)", category="Produce", location="Front Section", points=120, price=4.99),
            ChallengeItemModel(id="53", name="American Cheese Slices (24 ct)", category="Dairy", location="Aisle 3, Right", points=160, price=4.79),
            ChallengeItemModel(id="54", name="Swiss Cheese Slices", category="Dairy", location="Aisle 3, Right", points=170, price=5.49),
            ChallengeItemModel(id="55", name="Thick-Cut Bacon", category="Meat", location="Aisle 1, Back", points=140, price=7.99),
            ChallengeItemModel(id="56", name="Coleslaw Mix", category="Produce", location="Front Section", points=100, price=2.69),
        ],
    ),
    ChallengeModel(
        id="6",
        title="Baking Bonanza",
        description="Gather supplies for weekend baking",
        points=400,
        timeRemaining="4h 20m",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        items=[
            # existing
            ChallengeItemModel(id="22", name="All-Purpose Flour", category="Baking", location="Aisle 8, Left", points=100, price=4.99),
            ChallengeItemModel(id="23", name="Sugar", category="Baking", location="Aisle 8, Left", points=100, price=3.99, isPromo=True),
            ChallengeItemModel(id="24", name="Butter", category="Dairy", location="Aisle 3, Center", points=100, price=5.49),
            ChallengeItemModel(id="25", name="Vanilla Extract", category="Baking", location="Aisle 8, Center", points=100, price=6.99),

            # new (Baking/Dairy only)
            ChallengeItemModel(id="57", name="Baking Powder", category="Baking", location="Aisle 8, Left", points=85, price=2.49),
            ChallengeItemModel(id="58", name="Baking Soda", category="Baking", location="Aisle 8, Left", points=80, price=1.29),
            ChallengeItemModel(id="59", name="Brown Sugar", category="Baking", location="Aisle 8, Left", points=95, price=2.79),
            ChallengeItemModel(id="60", name="Powdered Sugar", category="Baking", location="Aisle 8, Left", points=90, price=2.59),
            ChallengeItemModel(id="61", name="Chocolate Chips", category="Baking", location="Aisle 8, Center", points=110, price=3.49, isPromo=True),
            ChallengeItemModel(id="62", name="Cocoa Powder", category="Baking", location="Aisle 8, Center", points=110, price=4.29),
            ChallengeItemModel(id="63", name="Active Dry Yeast (3 pk)", category="Baking", location="Aisle 8, Right", points=95, price=1.99),
            ChallengeItemModel(id="64", name="Large Eggs (12 ct)", category="Dairy", location="Aisle 3, Center", points=100, price=3.29),
            ChallengeItemModel(id="65", name="Whole Milk (Vitamin D)", category="Dairy", location="Aisle 3, Left", points=90, price=3.39),
            ChallengeItemModel(id="66", name="Heavy Whipping Cream", category="Dairy", location="Aisle 3, Center", points=105, price=4.19),
            ChallengeItemModel(id="67", name="Vanilla Beans (2 ct)", category="Baking", location="Aisle 8, Center", points=140, price=8.99),
            ChallengeItemModel(id="68", name="Almond Extract", category="Baking", location="Aisle 8, Center", points=95, price=3.69),
            ChallengeItemModel(id="69", name="Ground Cinnamon", category="Baking", location="Aisle 8, Right", points=90, price=2.99),
            ChallengeItemModel(id="70", name="Ground Nutmeg", category="Baking", location="Aisle 8, Right", points=90, price=3.29),
            ChallengeItemModel(id="71", name="Cream Cheese (8 oz)", category="Dairy", location="Aisle 3, Right", points=100, price=2.79, isPromo=True),
            ChallengeItemModel(id="72", name="Sour Cream (16 oz)", category="Dairy", location="Aisle 3, Right", points=95, price=2.49),
        ],
    ),
]
CATALOG.clear()
ingest_challenges_into_catalog(food_items)
class PurchaseEvent(BaseModel):
    user_id: str
    item_id: str
    quantity: int
    price_paid: float
    purchased_at: datetime

# naive in-memory stores
PURCHASE_HISTORY: Dict[str, List[PurchaseEvent]] = {}  # user_id -> events
STOREWIDE_POPULARITY: Dict[str, int] = {}  # item_id -> count

def record_purchase(evt: PurchaseEvent):
    PURCHASE_HISTORY.setdefault(evt.user_id, []).append(evt)
    STOREWIDE_POPULARITY[evt.item_id] = STOREWIDE_POPULARITY.get(evt.item_id, 0) + evt.quantity

# --- Scoring ---
def exp_decay_score(events: List[PurchaseEvent], now: datetime, half_life_days: float = 30.0) -> Dict[str, float]:
    """Return per-item affinity given a user's events."""
    if half_life_days <= 0:
        half_life_days = 30.0
    lam = math.log(2) / half_life_days
    scores: Dict[str, float] = {}
    for e in events:
        age_days = (now - e.purchased_at).total_seconds() / 86400.0
        w = e.quantity * math.exp(-lam * age_days)
        scores[e.item_id] = scores.get(e.item_id, 0.0) + w
    return scores

# --- Candidate pools ---
def split_candidates(catalog: Dict[str, ChallengeItemModel]) -> Tuple[List[str], List[str]]:
    regular_ids, promo_ids = [], []
    for iid, item in catalog.items():
        if item.isPromo:
            promo_ids.append(iid)
        else:
            regular_ids.append(iid)
    return regular_ids, promo_ids

# --- Diversity helper ---
def greedy_diversify_ranked(item_ids: List[str], catalog: Dict[str, ChallengeItemModel],
                            max_per_category: int = 2) -> List[str]:
    """Given a *ranked* list, greedily pick respecting per-category caps."""
    picked, cat_counts = [], {}
    for iid in item_ids:
        cat = catalog[iid].category
        if cat_counts.get(cat, 0) < max_per_category:
            picked.append(iid)
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
    return picked

# --- Selection ---
def select_items_for_challenge(
    user_id: str,
    catalog: Dict[str, ChallengeItemModel],
    n_items: int = 6,
    promo_ratio: float = 0.33,
    half_life_days: float = 30.0,
    max_per_category: int = 2,
    allowed_categories: Optional[List[str]] = None,  # thematic filter
) -> List[ChallengeItemModel]:
    """Return concrete items for one challenge."""
    now = datetime.utcnow()

    # filter by theme if provided
    themed_ids = [iid for iid, it in catalog.items()
                  if (allowed_categories is None or it.category in allowed_categories)]

    themed_catalog = {iid: catalog[iid] for iid in themed_ids}
    regular_ids, promo_ids = split_candidates(themed_catalog)

    # how many of each
    n_promos = max(0, min(len(promo_ids), round(n_items * promo_ratio)))
    n_regular = max(0, n_items - n_promos)

    # user scores
    user_events = PURCHASE_HISTORY.get(user_id, [])
    regular_rank = regular_ids[:]
    if user_events:
        scores = exp_decay_score(user_events, now, half_life_days)
        # backfill zero for unseen items to stable sort by score desc, then small popularity bonus
        def key(iid: str):
            pop = STOREWIDE_POPULARITY.get(iid, 0)
            return (scores.get(iid, 0.0), pop)
        regular_rank.sort(key=key, reverse=True)
    else:
        # cold start: use store popularity, then random
        regular_rank.sort(key=lambda iid: STOREWIDE_POPULARITY.get(iid, 0), reverse=True)
        if not regular_rank:
            random.shuffle(regular_rank)

    # diversity
    regular_rank_div = greedy_diversify_ranked(regular_rank, themed_catalog, max_per_category)[:n_regular]

    # promos: simple pop-weighted sampling without replacement
    if promo_ids:
        weighted = [(iid, STOREWIDE_POPULARITY.get(iid, 1)) for iid in promo_ids]
        total = sum(w for _, w in weighted) or 1
        # normalize weights to probabilities
        probs = [(iid, w / total) for iid, w in weighted]
        chosen_promos = []
        pool = probs[:]
        for _ in range(n_promos):
            r = random.random()
            acc = 0.0
            pick = pool[0][0]
            for iid, p in pool:
                acc += p
                if r <= acc:
                    pick = iid
                    break
            chosen_promos.append(pick)
            # remove picked and renormalize
            pool = [(iid, p) for iid, p in pool if iid != pick]
            s = sum(p for _, p in pool) or 1.0
            pool = [(iid, p / s) for iid, p in pool]
    else:
        chosen_promos = []

    chosen_ids = (regular_rank_div + chosen_promos)[:n_items]
    random.shuffle(chosen_ids)  # avoid all regulars appearing first

    return [themed_catalog[iid] for iid in chosen_ids]

# --- Challenge Templates (themes) ---
class ChallengeTemplate(BaseModel):
    id: str
    title: str
    description: str
    color: str
    default_points: int = 300
    default_timeRemaining: str = "3h 00m"
    allowed_categories: Optional[List[str]] = None

TEMPLATES: Dict[str, ChallengeTemplate] = {
    "health": ChallengeTemplate(
        id="health", title="Health & Wellness",
        description="Pick up vitamins and supplements",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        allowed_categories=["Health", "Dairy"]
    ),
    "bbq": ChallengeTemplate(
        id="bbq", title="Weekend BBQ",
        description="Everything you need for a backyard BBQ",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        allowed_categories=["Meat", "Bakery", "Condiments", "Produce", "Dairy"]
    ),
    "baking": ChallengeTemplate(
        id="baking", title="Baking Bonanza",
        description="Gather supplies for weekend baking",
        color="from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
        allowed_categories=["Baking", "Dairy"]
    ),
}

# --- Endpoints ---

@app.post("/history")
def add_purchase(evt: PurchaseEvent):
    if evt.item_id not in CATALOG:
        raise HTTPException(status_code=400, detail="Unknown item_id")
    record_purchase(evt)
    return {"ok": True}

@app.get("/challenges", response_model=List[ChallengeModel])
def list_challenges(ids: Optional[str] = None):
    """Unchanged from your original: returns pre-defined 4–6 or a subset."""
    data = food_items
    if ids:
        wanted = set(x.strip() for x in ids.split(","))
        data = [c for c in food_items if c.id in wanted]
    return data

# @app.get("/challenges/{challenge_id}", response_model=ChallengeModel)
# def get_challenge(challenge_id: str):
#     for c in food_items:
#         if c.id == challenge_id:
#             return c
#     raise HTTPException(status_code=404, detail="Challenge not found")


ID_TO_TEMPLATE = {
    "4": "health",
    "5": "bbq",
    "6": "baking",
}

@app.get("/challenges/{challenge_id}", response_model=ChallengeModel)
def get_challenge(
    challenge_id: str,
    user_id: Optional[str] = Query(None, description="User to personalize for"),
    n_items: int = Query(6, ge=1, le=20),
    promo_ratio: float = Query(PROMO_DEFAULT, ge=0.0, le=1.0),
    half_life_days: float = Query(30.0, gt=0.0),
    max_per_category: int = Query(2, ge=1),
):
    """
    For challenge IDs 4–6, dynamically (re)generate items using the user's purchase history
    and promo mix. The response keeps the same 'id' (4/5/6) so your UI doesn't change.
    Other IDs still return the static challenge, if present.
    """
    # If this is one of the "smart" IDs, generate on the fly
    if challenge_id in ID_TO_TEMPLATE:
        template_id = ID_TO_TEMPLATE[challenge_id]
        if template_id not in TEMPLATES:
            raise HTTPException(status_code=404, detail="Template missing for this challenge")

        tpl = TEMPLATES[template_id]

        # Personalize; if user_id is None or has no history, we gracefully fall back to popularity
        items = select_items_for_challenge(
            user_id=user_id or "anon",
            catalog=CATALOG,
            n_items=n_items,
            promo_ratio=promo_ratio,
            half_life_days=half_life_days,
            max_per_category=max_per_category,
            allowed_categories=tpl.allowed_categories,
        )

        total_points = sum(i.points for i in items) if items else tpl.default_points

        return ChallengeModel(
            id=challenge_id,  # keep original id for UI stability
            title=tpl.title,
            description=tpl.description,
            points=total_points,
            timeRemaining=tpl.default_timeRemaining,
            color=tpl.color,
            items=items,
            currentPoints=0,
            completed=False,
        )

    # Otherwise: original static behavior for non-4/5/6 ids
    for c in food_items:
        if c.id == challenge_id:
            return c
    raise HTTPException(status_code=404, detail="Challenge not found")

@app.get("/challenges/generate", response_model=ChallengeModel)
def generate_challenge(
    user_id: str,
    template_id: str = Query("bbq"),
    n_items: int = Query(6, ge=1, le=20),
    promo_ratio: float = Query(0.33, ge=0.0, le=1.0),
    half_life_days: float = Query(30.0, gt=0.0),
    max_per_category: int = Query(2, ge=1),
):
    if template_id not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Unknown template")
    tpl = TEMPLATES[template_id]

    items = select_items_for_challenge(
        user_id=user_id,
        catalog=CATALOG,
        n_items=n_items,
        promo_ratio=promo_ratio,
        half_life_days=half_life_days,
        max_per_category=max_per_category,
        allowed_categories=tpl.allowed_categories
    )

    # points can be derived or left as template default; here we sum item points.
    total_points = sum(i.points for i in items) if items else tpl.default_points

    return ChallengeModel(
        id=f"gen-{template_id}-{user_id}-{int(datetime.utcnow().timestamp())}",
        title=tpl.title,
        description=tpl.description,
        points=total_points,
        timeRemaining=tpl.default_timeRemaining,
        color=tpl.color,
        items=items,
        currentPoints=0,
        completed=False
    )

class HuntResult(BaseModel):
    # Keep the camelCase keys you requested
    userId: str = Field(..., description="User ID")
    shoppingCart: List[CartItem] = Field(default_factory=list)

# ------------- Health check -------------
@app.get("/")
def root():
    return {"status": "Coupon Hunt API is running!"}

# ------------- GET /shoppinglist -------------
# Accepts userId as a query parameter (e.g., /shoppinglist?userId=risha123)
@app.get("/shoppinglist")
def get_shopping_list(userId: str):
    """
    TODO (later):
      - query snowflake for last xyz purchases / typical purchases by date
      - generate probability distribution of likely purchases today
      - include additional/sponsored items based on store parameter
      - return list of N items + product info
    For now: return a generic list.
    """
    return {
        "status": "okay",
        "userId": userId,
        "list": [
            { "id": "22", "name": "All-Purpose Flour", "category": "Baking", "location": "Aisle 8, Left",   "points": 100, "price": 3.49 },
            { "id": "23", "name": "Sugar",             "category": "Baking", "location": "Aisle 8, Left",   "points": 100, "isPromo": True, "price": 2.99 },
            { "id": "24", "name": "Butter",            "category": "Dairy",  "location": "Aisle 3, Center", "points": 100, "price": 4.49 },
            { "id": "25", "name": "Vanilla Extract",   "category": "Baking", "location": "Aisle 8, Center", "points": 100, "price": 5.99 },
        ],
    }

# ------------- POST /huntresult -------------
# Expects: { "userId": "...", "shoppingCart": [ {id, name, ...}, ... ] }
# For now: just echo it back.
@app.post("/huntresult")
def submit_hunt_result(payload: HuntResult):
    # Echo back exactly what you sent, plus a status.
    try:
        echoed = payload.model_dump(by_alias=True)  # pydantic v2
    except AttributeError:
        echoed = payload.dict(by_alias=True)        # pydantic v1 fallback

    return {
        "status": "okay",
        "data": echoed
    }
