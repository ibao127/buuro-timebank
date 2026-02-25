# Buuro Timebank — System Architecture (MVP)

This document defines the core system logic for the Buuro Timebank.

---

# 1. Core Concept

The system is a mutual credit timebank.

- Time unit: minutes (integer)
- Users can go negative down to -120 minutes
- No external currency exists
- Buuro acts as clearing logic only (not a stored account)

Credits are created and destroyed through confirmed exchanges.

---

# 2. Balance Model

Each user has:

- confirmed_balance (integer)
- reserved_minutes (integer)

Available balance is computed:

available_balance = confirmed_balance - reserved_minutes

Constraint:
A user cannot create a Need if:

available_balance - estimated_minutes < -120

---

# 3. Hold Mechanism

When a Need is created:

- estimated_minutes are added to reserved_minutes
- No transaction is created
- confirmed_balance remains unchanged

When a Need is:

CANCELLED → reserved_minutes decrease  
EXPIRED → reserved_minutes decrease  
CONFIRMED → reserved_minutes decrease + transactions created  

This prevents double-spending of minutes.

---

# 4. Settlement Logic

Transactions are created ONLY when:

Need.status == CONFIRMED

Two transactions are created:

1) Requester → Buuro (internal accounting)
2) Buuro → Provider

OR simplified:
- Requester confirmed_balance -= minutes
- Provider confirmed_balance += minutes

Transactions are immutable.

---

# 5. Time Constraints

- scheduled_start_at is required
- Must be within 30 days of Need creation
- Provider cannot mark completed before scheduled_start_at

---

# 6. Visibility Rules

- Needs are publicly browsable
- Contact info is hidden until ACCEPTED
- Only requester and selected provider can see contact details after ACCEPTED