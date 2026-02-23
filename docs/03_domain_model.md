# Domain Model (MVP)

This document defines the core entities, fields, relationships, and constraints for the Buuro Timebank system.

All time values are stored in minutes (integer).

---

## 1. User

Represents a registered participant in the platform.

### Fields
- id (primary key)
- name
- email (unique)
- phone_number (nullable)
- neighbourhood
- bio (nullable)
- created_at
- updated_at

### Relationships
- has_one Account
- has_many Needs (as requester)
- has_many Offers (as provider)
- has_many Feedback entries

### Visibility Rules
- phone_number is not publicly visible.
- email is not publicly visible.
- When a Need transitions to ACCEPTED:
  - The requester and the selected provider may view each other’s phone_number and email.
- Contact details are not visible to other users.

---

## 2. Account

Represents the time credit balance of a User.

### Fields
- id (primary key)
- user_id (foreign key → User)
- posted_balance_minutes (integer)
- reserved_balance_minutes (integer)
- created_at
- updated_at

### Derived Value
- available_balance_minutes = posted_balance_minutes - reserved_balance_minutes

### Constraints
- A user cannot create a Need if available_balance_minutes < -120.
- Buuro Bank is a special system account (no user_id).

---

## 3. Skill

Represents predefined categories of help.

### Fields
- id (primary key)
- name (unique)
- created_at
- updated_at

### Relationships
- has_many Needs
- many-to-many with User (skills offered)

---

## 4. Need

Represents a structured request for help.

### Fields
- id (primary key)
- requester_id (foreign key → User)
- skill_id (foreign key → Skill)
- title
- description
- neighbourhood
- estimated_minutes (integer)
- scheduled_start_at (datetime; must be within 30 days of creation)
- status (enum)
- created_at
- updated_at

### Status Values
- OPEN
- OFFERED
- ACCEPTED
- DONE_PENDING_REQUESTER
- CONFIRMED
- DISPUTED
- AWAITING_REVIEW
- CANCELLED
- EXPIRED

### Relationships
- belongs_to requester (User)
- belongs_to Skill
- has_many Offers
- has_one Hold
- has_many Transactions (indirect via confirmation)

### Constraints
- A Hold must be created at Need creation.
- Need is editable only while status = OPEN.
- Need transitions to OFFERED when at least one ACTIVE Offer exists.
- "Completed" action is allowed only at or after scheduled_start_at.

---

## 5. Offer

Represents a provider volunteering to fulfill a Need.

### Fields
- id (primary key)
- need_id (foreign key → Need)
- provider_id (foreign key → User)
- status (enum)
- created_at
- updated_at

### Status Values
- ACTIVE
- SELECTED
- WITHDRAWN
- DECLINED

### Constraints
- A provider cannot create more than one ACTIVE Offer per Need.
- Other ACTIVE offers remain ACTIVE when one offer is SELECTED.
- When Need is CONFIRMED, CANCELLED, or EXPIRED, all remaining ACTIVE offers become DECLINED.

---

## 6. Hold

Represents reserved minutes against a requester’s Account.

### Fields
- id (primary key)
- account_id (foreign key → Account)
- need_id (foreign key → Need)
- amount_minutes (integer)
- status (enum: ACTIVE, CONSUMED, RELEASED)
- created_at
- updated_at

### Rules
- Created when Need is created.
- CONSUMED when Need is CONFIRMED.
- RELEASED when Need is CANCELLED or EXPIRED.

---

## 7. Transaction

Represents immutable ledger entries.

### Fields
- id (primary key)
- from_account_id (foreign key → Account)
- to_account_id (foreign key → Account)
- amount_minutes (integer)
- need_id (foreign key → Need)
- created_at

### Rules
- Created only when Need transitions to CONFIRMED.
- Two transactions are created per confirmed Need:
  1) Buuro Bank → Provider
  2) Requester → Buuro Bank
- Transactions are immutable.

---

## 8. Feedback

Represents trust signals after completion.

### Fields
- id (primary key)
- need_id (foreign key → Need)
- from_user_id (foreign key → User)
- to_user_id (foreign key → User)
- rating (enum: UP, DOWN)
- comment (nullable)
- created_at

### Rules
- Feedback allowed only when Need status = CONFIRMED.
- Each participant may leave only one feedback entry per Need.

---

# System Invariants

1. Ledger transactions are created only at CONFIRMED.
2. Holds must exist before ACCEPTED.
3. posted_balance_minutes changes only via Transactions.
4. reserved_balance_minutes changes only via Hold lifecycle.
5. available_balance must never be used directly for storage; it is derived.