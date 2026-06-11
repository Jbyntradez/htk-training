# CRM Usage Guide

## Purpose

The CRM is the source of truth for HTK outreach. If an action is not logged, it did not happen.

Use `templates/Lead_Tracker.csv` as the field structure for the live tracker.

## Required Fields

| Field | What to record |
| --- | --- |
| `Lead_ID` | A unique ID in the format `HTK-YYYYMMDD-001` |
| `Created_Date` | Date the lead was first logged in `YYYY-MM-DD` format |
| `X_Handle` | Prospect's X handle |
| `Profile_URL` | Full X profile URL |
| `Prospect_Name` | Publicly stated name when available; otherwise leave blank |
| `Segment` | Athlete, Former Athlete, Military, Veteran, First Responder, Fitness Enthusiast, or High Performer |
| `Public_Signal` | Specific public reason the profile is relevant |
| `Fit_Score` | Prospecting score from 0-8 |
| `Lead_Stage` | One approved stage |
| `Last_Contact_Date` | Most recent outreach or reply date |
| `Last_Contact_Type` | First DM, Follow-Up 1, Follow-Up 2, Follow-Up 3, Active Reply, Call Invite, Booking Confirmation, Reminder, or No-Show Follow-Up |
| `Next_Action` | Exact next action |
| `Next_Action_Date` | Date the next action is due |
| `Goal` | Prospect's stated performance goal |
| `Obstacle` | Prospect's stated main obstacle |
| `Why_Now` | Prospect's reason for acting now |
| `Coaching_Openness` | Yes, No, or Unclear |
| `Qualification_Score` | Score from 0-10 |
| `Calendar_Email` | Email used only after the prospect agrees to schedule |
| `Time_Zone` | Prospect's scheduling time zone |
| `Call_Date` | Confirmed call date |
| `Call_Time` | Confirmed call time with time zone |
| `Closed_Lost_Reason` | Approved reason when stage is `Closed Lost` |
| `Opt_Out` | Yes or No |
| `Notes` | Concise operational context |

## Data Entry Rules

- Search the tracker before creating a lead.
- Create the record before sending the first DM.
- Update the record immediately after every meaningful action.
- Use `YYYY-MM-DD` dates.
- Do not store passwords, payment information, medical information, home addresses, or private details unrelated to scheduling.
- Keep notes factual and professional.
- Do not guess.
- Leave a field blank when the prospect has not provided the information.

## Lead ID Rules

Create IDs in sequence for the day:

- First lead logged on June 2, 2026: `HTK-20260602-001`
- Second lead logged on June 2, 2026: `HTK-20260602-002`
- First lead logged on June 3, 2026: `HTK-20260603-001`

Never reuse an ID.

## Stage Update Examples

### Before First DM

- `Lead_Stage`: `New Lead`
- `Next_Action`: `Send personalized first-contact DM`
- `Next_Action_Date`: Today's date

### After First DM

- `Lead_Stage`: `Contacted`
- `Last_Contact_Type`: `First DM`
- `Next_Action`: `Send Follow-Up 1 if no reply`
- `Next_Action_Date`: Three calendar days later

### After Meaningful Reply

- `Lead_Stage`: `Responded`
- `Last_Contact_Type`: `Active Reply`
- `Next_Action`: `Reply and clarify current training goal`
- `Next_Action_Date`: Today's date

### After Goal Discussion

- `Lead_Stage`: `Engaged`
- `Next_Action`: `Ask main obstacle`
- `Next_Action_Date`: Today's date

### After Qualification

- `Lead_Stage`: `Qualified`
- `Next_Action`: `Invite call or collect scheduling details`
- `Next_Action_Date`: Today's date

### After Calendar Invite

- `Lead_Stage`: `Call Scheduled`
- `Next_Action`: `Send 24-hour reminder`
- `Next_Action_Date`: One calendar day before the call

## Daily CRM Audit

Before submitting the daily report:

1. Filter for touched leads.
2. Confirm every touched lead has the correct stage.
3. Confirm every non-final lead has a next action and date.
4. Confirm every opt-out is marked.
5. Confirm every scheduled call has complete booking details.
6. Confirm there are no duplicate handles.

## Weekly CRM Audit

The manager samples 10 records and checks:

- Data completeness
- Correct stages
- Prospect fit
- Follow-up timing
- Opt-out handling
- Scheduled-call completeness
- Professional notes
