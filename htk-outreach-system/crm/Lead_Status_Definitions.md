# Lead Status Definitions

## Rule

Every lead has exactly one current stage. Update the stage immediately after the event that changes it.

Use only these stages:

1. New Lead
2. Contacted
3. Responded
4. Engaged
5. Qualified
6. Call Scheduled
7. Closed Won
8. Closed Lost

## Stage Definitions

### New Lead

**Definition:** A researched prospect who appears to fit HTK and has been logged before outreach.

**Required before entry:**

- X handle
- Profile URL
- Segment
- Public signal
- Fit score
- Next action
- Next-action date

**Move forward when:** The VA sends the first personalized DM.

### Contacted

**Definition:** The VA sent the first personalized DM and is waiting for a meaningful reply.

**Required action:**

- Record the first-contact date.
- Record the exact sent message or a faithful summary.
- Set Follow-Up 1 for three calendar days later.

**Move forward when:** The prospect sends a meaningful reply.

**Move to `Closed Lost` when:** The prospect does not reply after the final follow-up or opts out.

### Responded

**Definition:** The prospect sent a meaningful reply, but the VA has not yet established enough context to call the conversation engaged.

**Meaningful reply examples:**

- Answers the opening question
- Asks what HTK is
- Shares a training goal
- Asks why HTK messaged

**Not meaningful:**

- Like
- Follow
- Emoji-only reaction
- Automated response
- Spam

**Move forward when:** The prospect discusses a goal, obstacle, or current training context.

### Engaged

**Definition:** The prospect is participating in a real two-way conversation and has shared enough context to begin qualification.

**Required CRM notes:**

- Current training
- Performance goal when known
- Obstacle when known
- Next qualification question

**Move forward when:** The prospect meets all qualification gates.

**Move to `Closed Lost` when:** The prospect declines, is not a fit, or asks to stop.

### Qualified

**Definition:** The prospect meets all five qualification gates:

- HTK market fit
- Performance goal
- Meaningful obstacle
- Coaching openness
- Willingness to speak with Jimmy within 14 days

**Required CRM notes:**

- Segment
- Goal
- Obstacle
- Why now
- Coaching openness
- Qualification score
- Scheduling next action

**Move forward when:** The calendar invitation is sent and all call details are recorded.

### Call Scheduled

**Definition:** A qualified prospect has a confirmed date, time, time zone, calendar email, and sent calendar invite.

**Required CRM notes:**

- Call date
- Call time
- Time zone
- Calendar email
- Invite sent
- Reminder status
- Founder handoff summary

**Move forward when:** The sales outcome is reported.

### Closed Won

**Definition:** Jimmy or the manager confirms that the prospect joined HTK.

**Required CRM notes:**

- Close date
- Outcome source
- Relevant manager note

The VA does not mark a lead `Closed Won` based on assumption.

### Closed Lost

**Definition:** The prospect will not move forward at this time.

**Required CRM notes:**

- Closed-lost reason
- Close date
- Opt-out status
- Whether future contact is prohibited

Use one reason:

- No response after final follow-up
- Not interested
- Opt-out
- Timing - prospect asked to pause
- Not an HTK fit
- Bodybuilding-only goal
- Not open to coaching
- No-show - no reschedule
- Under 18
- Unsafe or abusive conversation
- Manager decision

Do not contact a lead again when the reason is `Opt-out`, `Under 18`, or `Unsafe or abusive conversation`.

## Stage Transition Map

| Current stage | Normal next stage | Alternate close stage |
| --- | --- | --- |
| New Lead | Contacted | Closed Lost |
| Contacted | Responded | Closed Lost |
| Responded | Engaged | Closed Lost |
| Engaged | Qualified | Closed Lost |
| Qualified | Call Scheduled | Closed Lost |
| Call Scheduled | Closed Won | Closed Lost |
| Closed Won | Final stage | Final stage |
| Closed Lost | Final stage | Final stage |

## Reopening A Closed Lead

Reopen a `Closed Lost` lead only when:

- The prospect initiates a new conversation, or
- The manager approves a specific relationship-based message.

Never reopen an opt-out, under-18, or unsafe lead.
