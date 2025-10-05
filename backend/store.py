from typing import List, Optional, Dict, Tuple
from pydantic import BaseModel, Field
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