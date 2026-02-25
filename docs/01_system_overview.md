# Buuro Timebank System - Overview (MVP)

## Goal
Build a scalable backend model for a neighbourhood timebank:
- residents post structured Needs to request help
- providers actively browse Needs and offer help voluntarily
- Buuro acts as a clearing bank
- balances can go negative down to -2 UURo
- abuse is prevented through a reservation/hold system

---

## Key Concepts
- Profiles: Including skills, biography, approximate area and potentially portfolio.
- Time unit: minutes (integer)
- -2 UURo floor = -120 minutes
- Posted balance: confirmed ledger history
- Reserved balance: active holds for open Needs
- Available balance = posted - reserved

- Needs are structured listings (closer to task postings than social posts)
- Providers step forward voluntarily (no forced assignment)

---

## User Flow

1. Requester creates a Need:
   - selects skill
   - sets estimated minutes
   - sets scheduled_start_at (required; must be within 30 days of creation)
   - system creates a HOLD (reserves minutes, similar to a pre-authorisation)

2. Providers browse and filter Needs.

3. Providers create Offers by clicking "Offer Help".

4. Requester selects one provider:
   - Need becomes ACCEPTED
   - the selected provider's Offer becomes SELECTED
   - other offers remain ACTIVE as standby options

5. Provider performs service and marks completed:
   - "Completed" is only allowed at or after scheduled_start_at (prevents premature completion)

6. Requester confirms completion within 48 hours (or disputes).

7. Ledger settles on confirmation:
   - Buuro Bank -> Provider (+minutes)
   - Requester -> Buuro Bank (+minutes)

8. Hold is consumed.

We aim for a reciprocity-based platform where help is offered voluntarily.