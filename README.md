CartQuest makes shopping fun by letting you complete scavenger hunt-like challenges, compete with friends, and win points that can be redeemed for coupons, gift cards, and more.

Completed for HackRU2025.

To run locally:

In terminal 1:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn api:app --port 8000 --reload
```

```bash
In terminal 2:
cd frontend
npm i
npm run dev
```