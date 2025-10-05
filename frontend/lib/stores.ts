export interface Store {
  id: string
  name: string
  theme: string
  logo: string
  colors: {
    primary: string
    secondary: string
    bg: string
    surface: string
    accent: string
  }
}

export const stores: Store[] = [
  {
    id: "shoprite",
    name: "ShopRite",
    theme: "shoprite",
    logo: "🛒",
    colors: {
      primary: "#E31837",
      secondary: "#FFD95A",
      bg: "#FFF8F5",
      surface: "#FFFFFF",
      accent: "#F7E3D3",
    },
  },
  {
    id: "fairway",
    name: "Fairway",
    theme: "fairway",
    logo: "🏪",
    colors: {
      primary: "#1D252C",
      secondary: "#E8C547",
      bg: "#F6F7F9",
      surface: "#FFFFFF",
      accent: "#EDE6D8",
    },
  },
  {
    id: "pricerite",
    name: "PriceRite",
    theme: "pricerite",
    logo: "💰",
    colors: {
      primary: "#0057B8",
      secondary: "#00A676",
      bg: "#F5FAFF",
      surface: "#FFFFFF",
      accent: "#E0F2FF",
    },
  },
  {
    id: "freshgrocer",
    name: "Fresh Grocer",
    theme: "freshgrocer",
    logo: "🥬",
    colors: {
      primary: "#1E7D32",
      secondary: "#F9A825",
      bg: "#F6FFF7",
      surface: "#FFFFFF",
      accent: "#EAF7E9",
    },
  },
  {
    id: "walmart",
    name: "Walmart",
    theme: "walmart",
    logo: "⭐",
    colors: {
      primary: "#FFD100",
      secondary: "#000000",
      bg: "#FFFFFF",
      surface: "#F5F5F5",
      accent: "#FFA500",
    },
  },
  {
    id: "target",
    name: "Target",
    theme: "target",
    logo: "🎯",
    colors: {
      primary: "#FF0000",
      secondary: "#FFFFFF",
      bg: "#F9F9F9",
      surface: "#FFFFFF",
      accent: "#FFA500",
    },
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
  price: number
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
      {
        id: "1",
        name: "Organic Eggs",
        category: "Dairy",
        location: "Aisle 3, Left",
        points: 50,
        isPromo: true,
        price: 4.99,
      },
      { id: "2", name: "Whole Wheat Bread", category: "Bakery", location: "Aisle 7, Center", points: 60, price: 3.49 },
      { id: "3", name: "Fresh Milk", category: "Dairy", location: "Aisle 3, Right", points: 70, price: 3.99 },
      { id: "4", name: "Orange Juice", category: "Beverages", location: "Aisle 5, Left", points: 70, price: 5.99 },
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
      {
        id: "5",
        name: "Chicken Breast",
        category: "Meat",
        location: "Aisle 1, Back",
        points: 100,
        isPromo: true,
        price: 8.99,
      },
      { id: "6", name: "Fresh Vegetables", category: "Produce", location: "Front Section", points: 80, price: 6.49 },
      { id: "7", name: "Pasta", category: "Pantry", location: "Aisle 8, Center", points: 60, price: 2.99 },
      { id: "8", name: "Parmesan Cheese", category: "Dairy", location: "Aisle 3, Left", points: 90, price: 7.99 },
      {
        id: "9",
        name: "Olive Oil",
        category: "Pantry",
        location: "Aisle 8, Right",
        points: 170,
        isPromo: true,
        price: 12.99,
      },
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
      { id: "10", name: "Potato Chips", category: "Snacks", location: "Aisle 6, Center", points: 50, price: 3.99 },
      {
        id: "11",
        name: "Chocolate Bar",
        category: "Snacks",
        location: "Aisle 9, Left",
        points: 50,
        isPromo: true,
        price: 2.49,
      },
      { id: "12", name: "Popcorn", category: "Snacks", location: "Aisle 6, Right", points: 50, price: 4.49 },
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
      { id: "13", name: "Multivitamins", category: "Health", location: "Aisle 10, Left", points: 100, price: 15.99 },
      {
        id: "14",
        name: "Protein Powder",
        category: "Health",
        location: "Aisle 10, Center",
        points: 120,
        isPromo: true,
        price: 29.99,
      },
      { id: "15", name: "Greek Yogurt", category: "Dairy", location: "Aisle 3, Center", points: 80, price: 5.99 },
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
      {
        id: "16",
        name: "Ground Beef",
        category: "Meat",
        location: "Aisle 1, Back",
        points: 150,
        isPromo: true,
        price: 9.99,
      },
      { id: "17", name: "Hot Dog Buns", category: "Bakery", location: "Aisle 7, Left", points: 80, price: 2.99 },
      { id: "18", name: "BBQ Sauce", category: "Condiments", location: "Aisle 4, Center", points: 100, price: 4.99 },
      { id: "19", name: "Lettuce", category: "Produce", location: "Front Section", points: 120, price: 2.49 },
      { id: "20", name: "Tomatoes", category: "Produce", location: "Front Section", points: 120, price: 3.99 },
      {
        id: "21",
        name: "Cheese Slices",
        category: "Dairy",
        location: "Aisle 3, Right",
        points: 180,
        isPromo: true,
        price: 5.99,
      },
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
      { id: "22", name: "All-Purpose Flour", category: "Baking", location: "Aisle 8, Left", points: 100, price: 4.99 },
      {
        id: "23",
        name: "Sugar",
        category: "Baking",
        location: "Aisle 8, Left",
        points: 100,
        isPromo: true,
        price: 3.99,
      },
      { id: "24", name: "Butter", category: "Dairy", location: "Aisle 3, Center", points: 100, price: 5.49 },
      { id: "25", name: "Vanilla Extract", category: "Baking", location: "Aisle 8, Center", points: 100, price: 6.99 },
    ],
  },
]
