export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: "credit" | "debit";
  source: "SMS" | "Manual" | "Bank";
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // May 2024 (Current Month in Mock)
  {
    id: "1",
    date: "2024-05-12",
    merchant: "Uber Rides",
    amount: 24.50,
    category: "Transportation",
    type: "debit",
    source: "SMS",
  },
  {
    id: "2",
    date: "2024-05-12",
    merchant: "Starbucks",
    amount: 8.75,
    category: "Food & Dining",
    type: "debit",
    source: "Manual",
  },
  {
    id: "3",
    date: "2024-05-11",
    merchant: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
    type: "debit",
    source: "Bank",
  },
  {
    id: "4",
    date: "2024-05-10",
    merchant: "Whole Foods Market",
    amount: 142.30,
    category: "Food & Dining",
    type: "debit",
    source: "SMS",
  },
  {
    id: "5",
    date: "2024-05-09",
    merchant: "Shell Station",
    amount: 45.00,
    category: "Transportation",
    type: "debit",
    source: "Manual",
  },
  {
    id: "6",
    date: "2024-05-08",
    merchant: "Amazon Purchase",
    amount: 89.99,
    category: "Shopping",
    type: "debit",
    source: "Bank",
  },
  {
    id: "7",
    date: "2024-05-08",
    merchant: "Electric Bill",
    amount: 120.50,
    category: "Bills & Utilities",
    type: "debit",
    source: "SMS",
  },
  {
    id: "8",
    date: "2024-05-07",
    merchant: "Gym Membership",
    amount: 50.00,
    category: "Health & Fitness",
    type: "debit",
    source: "Bank",
  },
  {
    id: "9",
    date: "2024-05-06",
    merchant: "Flight to NYC",
    amount: 350.00,
    category: "Travel",
    type: "debit",
    source: "Manual",
  },
  {
    id: "10",
    date: "2024-05-05",
    merchant: "Cinema City",
    amount: 32.00,
    category: "Entertainment",
    type: "debit",
    source: "SMS",
  },
  // April 2024
  {
    id: "11",
    date: "2024-04-20",
    merchant: "Target",
    amount: 65.20,
    category: "Shopping",
    type: "debit",
    source: "Bank",
  },
  {
    id: "12",
    date: "2024-04-15",
    merchant: "Sushi Place",
    amount: 42.00,
    category: "Food & Dining",
    type: "debit",
    source: "Manual",
  },
  // May 2023
  {
    id: "13",
    date: "2023-05-10",
    merchant: "Old Navy",
    amount: 35.50,
    category: "Shopping",
    type: "debit",
    source: "SMS",
  },
];

export const MOCK_MESSAGES = [
  "Acct XX1234 debited $24.50 for Uber Rides on 12-May. Bal: $1200.",
  "Purchase of $142.30 at Whole Foods Market on card ending 8899.",
  "Bill Payment: $120.50 to Electric Co successful.",
  "Alert: $32.00 spent at Cinema City.",
];
