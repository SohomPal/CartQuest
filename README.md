CartQuest makes shopping fun by letting you complete scavenger hunt-like challenges, compete with friends, and win points that can be redeemed for coupons, gift cards, and more.

Completed for HackRU2025.


https://github.com/user-attachments/assets/bf03d392-a71e-48be-8aa3-1d1e5a8e8a09


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
