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
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
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
    color: "from-pink-500 to-rose-500",
    items: [
      { id: "1", name: "Organic Eggs", category: "Dairy", location: "Aisle 3, Left" },
      { id: "2", name: "Whole Wheat Bread", category: "Bakery", location: "Aisle 7, Center" },
      { id: "3", name: "Fresh Milk", category: "Dairy", location: "Aisle 3, Right" },
      { id: "4", name: "Orange Juice", category: "Beverages", location: "Aisle 5, Left" },
    ],
  },
  {
    id: "2",
    title: "Dinner Party Prep",
    description: "Get ingredients for tonight's dinner",
    points: 500,
    timeRemaining: "5h 15m",
    color: "from-blue-500 to-cyan-500",
    items: [
      { id: "5", name: "Chicken Breast", category: "Meat", location: "Aisle 1, Back" },
      { id: "6", name: "Fresh Vegetables", category: "Produce", location: "Front Section" },
      { id: "7", name: "Pasta", category: "Pantry", location: "Aisle 8, Center" },
      { id: "8", name: "Parmesan Cheese", category: "Dairy", location: "Aisle 3, Left" },
      { id: "9", name: "Olive Oil", category: "Pantry", location: "Aisle 8, Right" },
    ],
  },
  {
    id: "3",
    title: "Snack Attack",
    description: "Stock up on your favorite snacks",
    points: 150,
    timeRemaining: "1h 45m",
    color: "from-amber-500 to-orange-500",
    items: [
      { id: "10", name: "Potato Chips", category: "Snacks", location: "Aisle 6, Center" },
      { id: "11", name: "Chocolate Bar", category: "Candy", location: "Aisle 9, Left" },
      { id: "12", name: "Popcorn", category: "Snacks", location: "Aisle 6, Right" },
    ],
  },
  {
    id: "4",
    title: "Health & Wellness",
    description: "Pick up vitamins and supplements",
    points: 300,
    timeRemaining: "3h 00m",
    color: "from-green-500 to-emerald-500",
    items: [
      { id: "13", name: "Multivitamins", category: "Health", location: "Aisle 10, Left" },
      { id: "14", name: "Protein Powder", category: "Health", location: "Aisle 10, Center" },
      { id: "15", name: "Greek Yogurt", category: "Dairy", location: "Aisle 3, Center" },
    ],
  },
  {
    id: "5",
    title: "Weekend BBQ",
    description: "Everything you need for a backyard BBQ",
    points: 750,
    timeRemaining: "6h 30m",
    color: "from-red-500 to-pink-500",
    items: [
      { id: "16", name: "Ground Beef", category: "Meat", location: "Aisle 1, Back" },
      { id: "17", name: "Hot Dog Buns", category: "Bakery", location: "Aisle 7, Left" },
      { id: "18", name: "BBQ Sauce", category: "Condiments", location: "Aisle 4, Center" },
      { id: "19", name: "Lettuce", category: "Produce", location: "Front Section" },
      { id: "20", name: "Tomatoes", category: "Produce", location: "Front Section" },
      { id: "21", name: "Cheese Slices", category: "Dairy", location: "Aisle 3, Right" },
    ],
  },
  {
    id: "6",
    title: "Baking Bonanza",
    description: "Gather supplies for weekend baking",
    points: 400,
    timeRemaining: "4h 20m",
    color: "from-purple-500 to-violet-500",
    items: [
      { id: "22", name: "All-Purpose Flour", category: "Baking", location: "Aisle 8, Left" },
      { id: "23", name: "Sugar", category: "Baking", location: "Aisle 8, Left" },
      { id: "24", name: "Butter", category: "Dairy", location: "Aisle 3, Center" },
      { id: "25", name: "Vanilla Extract", category: "Baking", location: "Aisle 8, Center" },
    ],
  },
]
