# 23. CRM Requirements

## Objective

Keep coaching records accurate enough that any authorized HTK team member can understand client status, risk, progress, and next action.

## Required Client Fields

| Field | Requirement |
|---|---|
| Client_ID | Unique ID |
| Client_Name | Full name |
| Email | Primary email |
| Phone | If approved and collected |
| Coach | Assigned coach |
| Segment | Athlete, Former Athlete, Military, Veteran, First Responder, Fitness Enthusiast, High Performer |
| Offer | Purchased coaching offer |
| Start_Date | Coaching start date |
| Current_Stage | Approved lifecycle stage |
| Primary_Goal | Main performance goal |
| Secondary_Goal | Optional |
| Main_Obstacle | Primary constraint |
| Training_Background | Summary |
| Schedule_Constraints | Work/life limits |
| Equipment | Available equipment |
| Injury_Flag | Yes or No |
| Clearance_Status | Cleared, Not Cleared, Unknown, Not Applicable |
| Weekly_Adherence | Current week |
| Check_In_Status | Submitted, Missed, Late, Paused |
| Accountability_Level | 1-4 |
| Progress_Marker | Current key metric |
| Program_Block | Current block name/dates |
| Next_Action | Exact action |
| Next_Action_Date | Due date |
| Retention_Risk | Low, Medium, High |
| Notes | Factual coaching notes |

## Approved Client Stages

1. Enrolled
2. Onboarding
3. Assessment Pending
4. Active Coaching
5. Progress Review
6. Renewal Window
7. Paused
8. Completed
9. Canceled
10. Escalated

## Stage Rules

- No client should remain in Onboarding without a next action.
- No client should remain Assessment Pending if intake is complete and coach has not reviewed it.
- Active Coaching clients must have a current program block and check-in status.
- Escalated clients must have manager owner and next action.
- Completed/Canceled clients must have outcome reason.

## Notes Rules

Good notes:

- Factual
- Brief
- Actionable
- Connected to goal, adherence, progress, or risk

Bad notes:

- "Lazy"
- "Difficult"
- "Bad attitude"
- "Probably lying"
- "Annoying"

Better:

> Missed 2 check-ins in 3 weeks. Client reports work travel and unclear training schedule. Coach set minimum effective week: 2 sessions + Friday check-in. Follow-up due 2026-06-14.

## CRM Update Triggers

Update CRM when:

- Client completes onboarding.
- Assessment is completed.
- Goal is set or changed.
- Program block changes.
- Check-in is reviewed.
- Client misses check-in.
- Client becomes non-compliant.
- Injury/safety flag appears.
- Progress review is completed.
- Renewal conversation occurs.
- Client pauses, cancels, completes, or renews.

## Daily CRM Audit

Before end of day:

- Every message requiring action has next action.
- Every check-in reviewed is logged.
- Every missed check-in is logged.
- Every injury flag is escalated.
- Every program change has a rationale.
- Every renewal-risk client is tagged.

