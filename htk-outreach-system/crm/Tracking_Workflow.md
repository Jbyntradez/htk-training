# CRM Tracking Workflow

## Objective

Keep the live tracker accurate from discovery through sales outcome.

## Workflow

### Step 1: Discover

When a prospect appears relevant:

1. Search the tracker by X handle.
2. Search the tracker by profile URL.
3. If the prospect already exists, follow the recorded next action.
4. If the prospect is new, continue research.

### Step 2: Research

1. Read the profile bio.
2. Review at least five recent posts or replies when available.
3. Confirm an HTK segment.
4. Record one specific public signal.
5. Calculate the 0-8 fit score.
6. Skip prospects scoring below 4.

### Step 3: Create The Lead

Create the record as `New Lead` before sending a DM.

Required fields:

- Lead ID
- Created date
- X handle
- Profile URL
- Segment
- Public signal
- Fit score
- Stage
- Next action
- Next-action date

### Step 4: Send First Contact

1. Draft a contextual message.
2. Check the message against `outreach/Outreach_Scripts.md`.
3. Send manually.
4. Update stage to `Contacted`.
5. Record `First DM`.
6. Set Follow-Up 1 for three calendar days later.

### Step 5: Follow Up

When a follow-up is due:

1. Confirm the prospect has not replied, declined, or opted out.
2. Send the correct follow-up manually.
3. Record the follow-up type.
4. Set the next follow-up date.
5. After Follow-Up 3 receives no response, move to `Closed Lost`.

### Step 6: Process A Reply

When the prospect replies:

1. Stop any no-reply follow-up sequence.
2. Move the stage to `Responded`.
3. Reply promptly during the assigned shift.
4. When the conversation includes training context, move to `Engaged`.
5. Ask the next unanswered qualification question.
6. Update goal, obstacle, why-now, and coaching-openness fields as information is confirmed.

### Step 7: Qualify

When every gate is confirmed:

1. Calculate the qualification score.
2. Move the stage to `Qualified`.
3. Send the call invitation.
4. Record the next action.

### Step 8: Schedule

When the prospect agrees:

1. Collect name, calendar email, time zone, and two available windows.
2. Create the calendar invitation.
3. Send the confirmation DM.
4. Record call details.
5. Move the stage to `Call Scheduled`.
6. Add the founder handoff summary.

### Step 9: Close

After the sales call:

1. Receive the outcome from Jimmy or the manager.
2. Move the record to `Closed Won` or `Closed Lost`.
3. Record the outcome date.
4. For `Closed Lost`, record the approved reason.

## Daily Filters

Use these filters every shift:

| Filter | Purpose |
| --- | --- |
| `Next_Action_Date <= today` and stage not closed | Work overdue and due actions |
| `Lead_Stage = Responded` or `Engaged` | Reply to active conversations first |
| `Lead_Stage = Qualified` | Schedule willing prospects |
| `Lead_Stage = Call Scheduled` and call within 48 hours | Send reminders |
| `Opt_Out = Yes` | Confirm no future contact |

## Error Correction

If you make a CRM error:

1. Correct it immediately.
2. Add a short note describing the correction.
3. Report it to the manager if it affected a message, an opt-out, or a scheduled call.
