export interface Store {
  id: string
  name: string
  theme: string
  logo: string
}

export const stores: Store[] = [
  {
    id: "shoprite",
    name: "ShopRite",
    theme: "shoprite",
    logo: "🛒",
  },
  {
    id: "priceright",
    name: "PriceRight",
    theme: "priceright",
    logo: "💰",
  },
  {
    id: "walmart",
    name: "Walmart",
    theme: "walmart",
    logo: "⭐",
  },
  {
    id: "target",
    name: "Target",
    theme: "target",
    logo: "🎯",
  },
]

export interface ChallengeItem {
  id: string
  name: string
  category: string
  location: string
  barcode?: string
  scanned?: boolean
  points: number
  isPromo?: boolean
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  currentPoints?: number
  timeRemaining: string
  items: ChallengeItem[]
  color: string
  completed?: boolean
}

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Quick Breakfast Run",
    description: "Grab essentials for a healthy breakfast",
    points: 250,
    timeRemaining: "2h 30m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "1", name: "Organic Eggs", category: "Dairy", location: "Aisle 3, Left", points: 50, isPromo: true },
      { id: "2", name: "Whole Wheat Bread", category: "Bakery", location: "Aisle 7, Center", points: 60 },
      { id: "3", name: "Fresh Milk", category: "Dairy", location: "Aisle 3, Right", points: 70 },
      { id: "4", name: "Orange Juice", category: "Beverages", location: "Aisle 5, Left", points: 70 },
    ],
  },
  {
    id: "2",
    title: "Dinner Party Prep",
    description: "Get ingredients for tonight's dinner",
    points: 500,
    timeRemaining: "5h 15m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "5", name: "Chicken Breast", category: "Meat", location: "Aisle 1, Back", points: 100, isPromo: true },
      { id: "6", name: "Fresh Vegetables", category: "Produce", location: "Front Section", points: 80 },
      { id: "7", name: "Pasta", category: "Pantry", location: "Aisle 8, Center", points: 60 },
      { id: "8", name: "Parmesan Cheese", category: "Dairy", location: "Aisle 3, Left", points: 90 },
      { id: "9", name: "Olive Oil", category: "Pantry", location: "Aisle 8, Right", points: 170, isPromo: true },
    ],
  },
  {
    id: "3",
    title: "Snack Attack",
    description: "Stock up on your favorite snacks",
    points: 150,
    timeRemaining: "1h 45m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "10", name: "Potato Chips", category: "Snacks", location: "Aisle 6, Center", points: 50 },
      { id: "11", name: "Chocolate Bar", category: "Candy", location: "Aisle 9, Left", points: 50, isPromo: true },
      { id: "12", name: "Popcorn", category: "Snacks", location: "Aisle 6, Right", points: 50 },
    ],
  },
  {
    id: "4",
    title: "Health & Wellness",
    description: "Pick up vitamins and supplements",
    points: 300,
    timeRemaining: "3h 00m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "13", name: "Multivitamins", category: "Health", location: "Aisle 10, Left", points: 100 },
      {
        id: "14",
        name: "Protein Powder",
        category: "Health",
        location: "Aisle 10, Center",
        points: 120,
        isPromo: true,
      },
      { id: "15", name: "Greek Yogurt", category: "Dairy", location: "Aisle 3, Center", points: 80 },
    ],
  },
  {
    id: "5",
    title: "Weekend BBQ",
    description: "Everything you need for a backyard BBQ",
    points: 750,
    timeRemaining: "6h 30m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "16", name: "Ground Beef", category: "Meat", location: "Aisle 1, Back", points: 150, isPromo: true },
      { id: "17", name: "Hot Dog Buns", category: "Bakery", location: "Aisle 7, Left", points: 80 },
      { id: "18", name: "BBQ Sauce", category: "Condiments", location: "Aisle 4, Center", points: 100 },
      { id: "19", name: "Lettuce", category: "Produce", location: "Front Section", points: 120 },
      { id: "20", name: "Tomatoes", category: "Produce", location: "Front Section", points: 120 },
      { id: "21", name: "Cheese Slices", category: "Dairy", location: "Aisle 3, Right", points: 180, isPromo: true },
    ],
  },
  {
    id: "6",
    title: "Baking Bonanza",
    description: "Gather supplies for weekend baking",
    points: 400,
    timeRemaining: "4h 20m",
    color: "from-[var(--store-gradient-from)] to-[var(--store-gradient-to)]",
    items: [
      { id: "22", name: "All-Purpose Flour", category: "Baking", location: "Aisle 8, Left", points: 100 },
      { id: "23", name: "Sugar", category: "Baking", location: "Aisle 8, Left", points: 100, isPromo: true },
      { id: "24", name: "Butter", category: "Dairy", location: "Aisle 3, Center", points: 100 },
      { id: "25", name: "Vanilla Extract", category: "Baking", location: "Aisle 8, Center", points: 100 },
    ],
  },
]
