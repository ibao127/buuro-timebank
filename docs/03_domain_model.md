# User Model (MVP)

This document defines the User-related data required for the Buuro Timebank MVP.

---

## User Entity

Each user has:

- id (UUID / primary key)
- name (string, required)
- email (string, unique, required)
- phone_number (string, required)
- password_hash (string, required)
- bio (text, optional)
- created_at (datetime)
- updated_at (datetime)

---

## Balance Fields

### confirmed_balance (integer, minutes)
Represents the net total of all CONFIRMED transactions.
This is derived from the transaction table.

### reserved_minutes (integer, minutes)
Represents the total minutes currently on hold due to OPEN or ACCEPTED Needs.

### available_balance (computed)
available_balance = confirmed_balance - reserved_minutes

Users cannot create a Need if:
available_balance - estimated_minutes < -120

---

## Relationships

User has many:
- Needs (as requester)
- Offers (as provider)
- Transactions

---

## Transaction Entity

Transactions are created ONLY when a Need reaches CONFIRMED.

Each transaction contains:

- id
- from_user_id
- to_user_id
- minutes (integer)
- need_id
- created_at

Rules:
- No transaction is created before confirmation.
- Transactions are immutable.

---

## Contact Visibility Rule

- Email and phone_number are not public.
- They become visible to the selected provider and requester only after a Need is ACCEPTED.

---

## Notes

- confirmed_balance should not be manually edited.
- Balance should always be derived from transactions.
- reserved_minutes should be updated when:
  - Need created → increase
  - Need cancelled → decrease
  - Need expired → decrease
  - Need confirmed → decrease