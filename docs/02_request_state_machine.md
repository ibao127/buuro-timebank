# Need and Offer State Machine (MVP)

## Overview
- A Need is created by a requester.
- Providers browse Needs and create Offers.
- The requester selects one Offer (provider).
- Completion requires requester confirmation before ledger settlement.
- Ledger transactions are created only at CONFIRMED.

---

## Need States
- OPEN
- OFFERED
- ACCEPTED
- DONE_PENDING_REQUESTER
- CONFIRMED
- DISPUTED
- AWAITING_REVIEW
- CANCELLED
- EXPIRED

---

## Offer States
Offers are dependent on a Need and do not exist independently.

### ACTIVE
- Created when a provider clicks “Offer Help”.
- Awaiting requester decision.

### WITHDRAWN
- Provider withdraws their offer before being selected.
- If no other ACTIVE offers remain, the Need transitions from OFFERED to OPEN.

### SELECTED
- Requester selects this offer.
- Associated Need transitions to ACCEPTED.
- Other ACTIVE offers remain ACTIVE unless the Need is confirmed, cancelled, or expired.

### DECLINED
- Automatically set when the Need is:
  - CONFIRMED
  - CANCELLED
  - EXPIRED

---

## OPEN
- Created by requester.
- scheduled_start_at is required and must be within 30 days of creation.
- A Hold is placed for estimated_minutes.

Rules:
- Need is editable while OPEN.
- Need transitions to OFFERED when at least one ACTIVE offer exists.

Next states:
- OFFERED (first provider offers help)
- CANCELLED (requester cancels; hold released)
- EXPIRED (scheduled_start_at passes without ACCEPTED; hold released)

---

## OFFERED
- One or more providers have ACTIVE offers.
- Need is locked for edits.

Next states:
- ACCEPTED (requester selects one provider)
- CANCELLED (requester cancels; hold released)
- EXPIRED (scheduled_start_at passes without ACCEPTED; hold released)

---

## ACCEPTED
- Requester selects one provider.
- One Offer becomes SELECTED.
- Other ACTIVE offers remain ACTIVE.

If the selected provider cancels before completion:
- The selected offer transitions to WITHDRAWN.
- If other ACTIVE offers exist, the Need transitions to OFFERED.
- If no other ACTIVE offers exist, the Need transitions to OPEN.
- The Hold remains reserved.

Next states:
- DONE_PENDING_REQUESTER (provider marks completed; only allowed at or after scheduled_start_at)
- CANCELLED (cancelled before completion; hold released)

---

## DONE_PENDING_REQUESTER
- Provider marks service completed.
- A 48-hour confirmation timer starts.

Requester must choose:
- CONFIRMED
- DISPUTED
- (no action → AWAITING_REVIEW after 48 hours)

---

## CONFIRMED
- Ledger settles:
  - Buuro Bank → Provider (+minutes)
  - Requester → Buuro Bank (+minutes)
- Hold is consumed.
- The Need is closed.
- All remaining ACTIVE offers transition to DECLINED.

---

## DISPUTED
- Requester reports an issue.
- Hold remains reserved.
- Goes to admin review.

Admin may resolve as:
- CONFIRMED (full or partial service; ledger posts; hold consumed)
- CANCELLED (service not delivered; hold released)

---

## AWAITING_REVIEW
- 48 hours passed without confirmation.
- Hold remains reserved.
- Goes to admin review.

Resolution options are the same as DISPUTED.

---

## CANCELLED
- Need cancelled before completion.
- Hold released.
- No ledger transactions created.
- All remaining ACTIVE offers transition to DECLINED.

---

## EXPIRED
- scheduled_start_at passed without the Need being ACCEPTED.
- Hold released.
- No ledger transactions created.
- All remaining ACTIVE offers transition to DECLINED.