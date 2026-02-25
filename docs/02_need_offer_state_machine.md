# Need + Offer State Machine (MVP)

Defines valid state transitions and guard rules.

---

# NEED STATES

Enum NeedStatus:

OPEN
OFFERED
ACCEPTED
DONE_PENDING_REQUESTER
CONFIRMED
DISPUTED
AWAITING_REVIEW
CANCELLED
EXPIRED

---

# 1. OPEN

Created by requester.

Actions allowed:
- Edit
- Cancel
- Receive offers

Transitions:
OPEN → OFFERED (first offer created)
OPEN → CANCELLED
OPEN → EXPIRED

---

# 2. OFFERED

At least one ACTIVE offer exists.

Actions allowed:
- Select offer
- Cancel
- Expire

Transitions:
OFFERED → ACCEPTED
OFFERED → CANCELLED
OFFERED → EXPIRED

---

# 3. ACCEPTED

One offer selected.

Rules:
- Other offers remain ACTIVE (standby)
- Need is locked (no edits)

If selected provider withdraws:
- If other ACTIVE offers exist → ACCEPTED → OFFERED
- Else → ACCEPTED → OPEN

Hold remains reserved.

Transitions:
ACCEPTED → DONE_PENDING_REQUESTER
ACCEPTED → CANCELLED

---

# 4. DONE_PENDING_REQUESTER

Provider marks completed.

Guard:
- current_time >= scheduled_start_at

48-hour timer starts.

Transitions:
DONE_PENDING_REQUESTER → CONFIRMED
DONE_PENDING_REQUESTER → DISPUTED
DONE_PENDING_REQUESTER → AWAITING_REVIEW (after 48h)

---

# 5. CONFIRMED

Actions:
- Create transactions
- Reduce reserved_minutes
- Close Need

Terminal state.

---

# 6. DISPUTED

Hold remains reserved.
Requires admin resolution.

Transitions:
DISPUTED → CONFIRMED (admin)
DISPUTED → CANCELLED (admin)

---

# 7. AWAITING_REVIEW

Auto-triggered after 48h of no requester action.

Hold remains reserved.

Requires admin resolution.

---

# 8. CANCELLED

Release reserved_minutes.
No transactions created.

Terminal state.

---

# 9. EXPIRED

Release reserved_minutes.
No transactions created.

Terminal state.

---

# OFFER STATES

Enum OfferStatus:

ACTIVE
SELECTED
WITHDRAWN
DECLINED

---

# Offer Rules

ACTIVE:
- Awaiting requester decision

SELECTED:
- Associated Need becomes ACCEPTED

WITHDRAWN:
- Provider cancels
- May trigger Need rollback

DECLINED:
- Auto-set when:
  - Another offer selected
  - Need cancelled
  - Need expired

Constraint:
One provider may only have one ACTIVE offer per Need. 