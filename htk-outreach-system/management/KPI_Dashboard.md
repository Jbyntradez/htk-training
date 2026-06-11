# KPI Dashboard

## Purpose

Use this dashboard to measure whether outreach is creating qualified conversations and scheduled calls without sacrificing brand quality.

Update the CSV dashboard daily. Review trends weekly. Do not change outreach volume based on a single day.

## Core KPI Definitions

| KPI | Definition | Daily target | Weekly target |
| --- | --- | ---: | ---: |
| New personalized DMs sent | First-contact manual DMs sent to researched prospects | 20 | 100 |
| Follow-ups sent | Manual follow-up DMs sent when due | 15 | 75 |
| Conversations started | Prospects who send a meaningful reply after outreach | 6 | 30 |
| Qualified leads | Prospects meeting all five qualification gates | 2 | 10 |
| Calls scheduled | Qualified prospects with a confirmed date, time, time zone, and email | 1 | 5 |

## Quality KPI Definitions

| KPI | Definition | Healthy standard |
| --- | --- | ---: |
| Response rate | Conversations started divided by new personalized DMs sent | 20%-35% |
| Qualification rate | Qualified leads divided by conversations started | 25%-45% |
| Booking rate from qualified leads | Calls scheduled divided by qualified leads | 40%-70% |
| Booking rate from new DMs | Calls scheduled divided by new personalized DMs sent | 3%-8% |
| Show rate | Completed calls divided by scheduled calls due to occur | 70% or higher |
| CRM completeness | Complete sampled CRM records divided by sampled CRM records | 98% or higher |
| Message QA pass rate | Approved sampled first-contact DMs divided by sampled DMs | 90% or higher |
| Compliance incidents | Confirmed rule or brand-policy violations | 0 |

## Metric Rules

### New Personalized DMs Sent

Count a DM only when:

- It is the first HTK outreach message to that prospect.
- The prospect was researched and logged first.
- The message was manually sent.
- The message is contextual and not a duplicate bulk message.

### Follow-Ups Sent

Count a follow-up only when:

- It follows the schedule in `outreach/Follow_Up_Scripts.md`.
- It is manually sent.
- The prospect has not opted out or declined.
- The sequence has not already reached the final follow-up.

### Conversations Started

Count a conversation when the prospect sends a meaningful reply.

Do not count:

- Likes
- Follows
- Emoji-only reactions
- Automated responses
- Spam
- A one-word opt-out such as `stop`

Record opt-outs separately.

### Qualified Leads

Count a qualified lead only when the CRM confirms:

- Market fit
- Performance goal
- Meaningful obstacle
- Coaching openness
- Call readiness within 14 days

### Calls Scheduled

Count a scheduled call only when:

- Date is confirmed.
- Time is confirmed.
- Time zone is confirmed.
- Calendar email is recorded.
- Calendar invitation is sent.
- CRM stage is `Call Scheduled`.

## Weekly Diagnosis

| Pattern | Likely issue | Management action |
| --- | --- | --- |
| Low response rate | Prospect quality or weak openers | Audit 20 prospects and 20 first-contact messages |
| Good response, low qualification | Targeting is too broad or questions are shallow | Audit fit score and qualification sequence |
| Good qualification, low booking | Call invitation is unclear or sent too late | Audit five qualified conversations |
| Good booking, low show rate | Confirmation workflow is incomplete | Audit calendar invites and reminders |
| High activity, low CRM completeness | VA is rushing | Reduce volume until CRM accuracy recovers |
| Any compliance incident | Unsafe process or poor judgment | Stop outreach and conduct immediate review |

## Dashboard Review Rhythm

### Daily

Review:

- Output against targets
- Active prospect queue
- Scheduled calls
- Opt-outs
- Escalations
- Account warnings

### Weekly

Review:

- Five-day totals
- Conversion rates
- 10 sampled first-contact DMs
- 10 sampled CRM records
- Every scheduled call handoff
- Closed-lost reasons

### Monthly

Review:

- Lead-source quality
- Show rate
- Closed-won feedback
- Closed-lost patterns
- Official X rule changes
- Whether any scripts need revision

Do not raise daily caps unless the manager has reviewed quality, compliance, and official X rules.
