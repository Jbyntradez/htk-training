# 11. CRM Requirements

The CRM is the source of truth for HTK sales. If it is not logged, it did not happen.

## Required Lead Fields

| Field | Requirement |
|---|---|
| Lead_ID | Unique ID |
| Created_Date | First date in CRM |
| Lead_Source | X outreach, referral, application, inbound, ads, event, other |
| Setter_Name | Person who created/booked lead when applicable |
| Closer_Name | Assigned closer |
| Prospect_Name | Full name |
| Email | Best email |
| Phone | If approved and provided |
| Segment | Athlete, Former Athlete, Military, Veteran, First Responder, Fitness Enthusiast, High Performer |
| Lead_Stage | Approved sales stage |
| Call_Date | Scheduled call date |
| Call_Time | Scheduled call time and time zone |
| Show_Status | Show, No-show, Rescheduled, Canceled |
| Performance_Goal | Prospect's stated goal |
| Current_Situation | Current training reality |
| Main_Obstacle | Primary gap or constraint |
| Consequence | Cost of inaction |
| Desired_Outcome | What success looks like |
| Commitment_Level | 1-10 or qualitative summary |
| Coaching_Openness | Yes, No, Unclear |
| Decision_Process | Self, spouse/partner, manager escalation, other |
| Disqualification_Score | Red flag score |
| Offer_Presented | Yes or No |
| Offer_Details | Approved offer presented |
| Objections | Main objections |
| Outcome | Closed Won, Closed Lost, Follow-Up, Escalated |
| Closed_Lost_Reason | Approved reason |
| Revenue | Amount collected when won |
| Payment_Status | Pending, Paid, Failed, Refunded by manager, N/A |
| Next_Action | Exact next step |
| Next_Action_Date | Date due |
| Follow_Up_Count | Number of post-call follow-ups |
| Notes | Concise factual summary |
| Brand_Risk | Yes or No |

## Approved Lead Stages

Use only these stages:

1. Lead
2. Qualified
3. Discovery Call Scheduled
4. Discovery Call Completed
5. Offer Presented
6. Decision Pending
7. Closed Won
8. Closed Lost
9. Onboarding Handoff Complete
10. Escalated

## Stage Definitions

### Lead

Prospect exists in CRM but has not been confirmed as call-ready.

### Qualified

Prospect meets basic fit and is worth scheduling or assigning to closer.

### Discovery Call Scheduled

Call is booked with date, time, time zone, and contact details.

### Discovery Call Completed

Live call occurred and discovery notes are recorded.

### Offer Presented

Closer presented HTK offer after confirming fit.

### Decision Pending

Prospect is qualified but has not made a final decision. Must have a specific next action and next-action date.

### Closed Won

Payment confirmed. Do not use before payment confirmation.

### Closed Lost

Prospect will not enroll at this time.

Approved closed-lost reasons:

- Not interested
- Not a fit
- Bodybuilding-only
- Not open to coaching
- No decision
- Timing
- Financial
- Wants free coaching
- Unrealistic expectations
- Medical clearance needed
- Under 18
- Unsafe / abusive
- No-show no reschedule
- Manager decision

### Onboarding Handoff Complete

Payment confirmed and onboarding handoff submitted.

### Escalated

Manager needs to handle before further sales action.

## Notes Standard

Good CRM notes are:

- Factual
- Short
- Useful to the next team member
- Based on what the prospect said
- Free of insults, speculation, or private commentary

Bad CRM notes:

- "Good guy"
- "Seems interested"
- "Probably rich"
- "Annoying"
- "Sold him hard"
- "Needs motivation"

Good CRM note example:

> Former college linebacker. Goal is to improve conditioning and mobility after years of strength-only training. Main obstacle is inconsistent schedule and no structured progression. Says goal matters now because he feels slow and stiff playing rec league sports. Open to coaching, commitment 8/10. Presented HTK monthly coaching. Objection: wants spouse input. Follow-up set for 2026-06-10 5 PM PT.

## Follow-Up Schedule Fields

Every non-final prospect must have:

- Next_Action
- Next_Action_Date
- Follow_Up_Count
- Follow_Up_Type
- Owner

No lead can sit in Decision Pending without a specific follow-up.

## CRM Audit

Daily closer audit:

1. Every completed call has notes.
2. Every offer presentation has outcome.
3. Every follow-up has next action/date.
4. Every Closed Won has payment confirmation and handoff.
5. Every Closed Lost has reason.
6. Every escalated conversation has a manager note.

