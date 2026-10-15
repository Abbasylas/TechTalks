# Asta’s Preparation Dashboard

## Summary

A single-screen dashboard that helps Asta track three training tasks while preparing for Lucifero. Asta can mark each task complete, undo completion, and see preparation progress calculated from the number of completed tasks.

This is a fictional learning project. No user research has been conducted, and the product has not been validated with users.

## Primary user and problem

**Primary user:** Asta, a fictional fighter preparing for Lucifero.

**Problem:** Asta’s training notes are scattered. He needs one clear place to see his training tasks, which tasks remain unfinished, and how much of the planned training he has completed.

## Goal of the first version

Provide one readable, accessible dashboard where Asta can review all three tasks, complete or undo any task, and immediately see an accurate completed / total count and preparation percentage.

Success for this version means the acceptance criteria below pass. The percentage represents task completion only; it does not measure combat ability or predict readiness to defeat Lucifero.

## Core features

There are exactly three core features:

1. **View training tasks:** Display Sword control, Physical endurance, and Team coordination together on one dashboard, with clear status text for each.
2. **Toggle completion:** Let Asta mark any task complete and undo completion as often as needed during the current page session.
3. **See calculated progress:** Show the completed / total count, preparation percentage, and a visual progress bar. Update all three immediately when a task changes.

## User stories

- As Asta, I want to see all my training tasks in one place so I know what to work on.
- As Asta, I want to mark a task complete so I can track what I have finished.
- As Asta, I want to undo completion so I can correct a mistake or revisit training.
- As Asta, I want to see my completed task count and preparation percentage so I can understand my progress at a glance.
- As a keyboard user, I want to operate every completion control without a mouse.

## Sample data and expected behaviour

The dashboard uses the following predefined data. The task order remains fixed.

| ID | Task | Description | Priority | Initial completion | Initial status text |
| --- | --- | --- | --- | --- | --- |
| sword-control | Sword control | Practise precise anti-magic sword movements. | High | false | Incomplete |
| physical-endurance | Physical endurance | Complete a focused strength and stamina session. | Medium | false | Incomplete |
| team-coordination | Team coordination | Review a preparation plan with the Black Bulls. | High | false | Incomplete |

Each task has equal weight. The total is always 3. Descriptions and priorities are predefined task information; priority does not affect the progress calculation.

**Calculation:** Preparation percentage = completed tasks divided by 3, multiplied by 100, rounded to the nearest whole number. Calculate from the current task states rather than adding or subtracting a fixed percentage.

| Completed tasks | Visible count | Preparation percentage |
| --- | --- | --- |
| 0 | 0 / 3 completed | 0% |
| 1 | 1 / 3 completed | 33% |
| 2 | 2 / 3 completed | 67% |
| 3 | 3 / 3 completed | 100% |

- Initially, every task is incomplete, the count is 0 / 3 completed, and progress is 0%.
- Completing Sword control changes only that task to Complete and updates the summary to 1 / 3 completed and 33%.
- Completing Physical endurance next updates the summary to 2 / 3 completed and 67%.
- Completing Team coordination next updates the summary to 3 / 3 completed and 100%.
- Undoing Sword control at that point returns its status to Incomplete and updates the summary to 2 / 3 completed and 67%.
- Any task can be toggled in any order. Toggling does not navigate away or reload the page.
- Completion is saved in browser localStorage and restored after refresh. New browsers start incomplete. If storage is blocked or invalid, the dashboard remains usable and shows a saving warning.

## Acceptance criteria

- [ ] One dashboard screen displays the product name and exactly the three predefined tasks, in the order shown above.
- [ ] With no saved data, all tasks are incomplete and the summary shows 0 / 3 completed and 0%.
- [ ] Each task has an independently operable completion control and visible Complete or Incomplete status text.
- [ ] Completing any one task updates its status, the count to 1 / 3 completed, and the percentage to 33% immediately.
- [ ] Completing any two tasks shows 2 / 3 completed and 67%; completing all three shows 3 / 3 completed and 100%.
- [ ] Undoing a completed task immediately recalculates the count and percentage using the remaining completed tasks.
- [ ] Toggling the same task twice restores its original state and the original summary values without changing other tasks.
- [ ] The progress bar matches the displayed percentage, including empty at 0% and full at 100%.
- [ ] All completion controls can be reached with Tab and toggled with Space, with a visible focus indicator.
- [ ] At a viewport width of 320 CSS pixels, text and controls remain readable and usable without horizontal page scrolling.
- [ ] Status is understandable without relying on colour, and controls expose their task names and checked states to assistive technology.
- [ ] Progress updates are announced politely to screen-reader users without moving keyboard focus.
- [ ] Refresh restores completed and undone tasks and recalculates the count and percentage. Blocked or malformed storage does not crash the dashboard.
- [ ] The implementation uses Next.js, TypeScript, and Tailwind CSS, with no extra routes or excluded features.

## Design and accessibility requirements

- Use a bold fantasy training theme inspired by Asta, with strong headings, dark surfaces, and vivid accent colours. Keep task labels, status text, and progress easy to read. Decorative artwork is optional and must not obscure tasks or progress.
- Establish a clear reading order: dashboard title, preparation summary, then the three training tasks.
- Keep the count and percentage visible as text alongside the progress bar. Label the summary “Preparation progress.”
- Use a single-column layout on small screens, readable text, adequate spacing, and controls with at least a 44 × 44 CSS pixel activation area.
- Prefer native checkboxes with visible task labels. The checked state means complete; the unchecked state means incomplete.
- Provide visible keyboard focus and logical tab order. Keep focus on the control after toggling.
- Use semantic headings and a semantic task list. Give the progress bar an accessible name and current, minimum, and maximum values.
- Provide a polite live announcement of the updated count and percentage.
- Meet WCAG AA contrast targets: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for essential control boundaries and state indicators.
- Communicate completion through text and control state as well as colour. If completed task names are struck through, keep them readable.
- Show “Progress is saved in this browser.” when saving works, and a clear warning when browser saving is unavailable. No animation is required.

## Stack

- **Next.js:** Serve the single dashboard screen.
- **TypeScript:** Define task data and completion state clearly.
- **Tailwind CSS:** Style the dashboard and its responsive layout.
- **Browser state and localStorage:** Keep task state in React and persist completed task IDs locally. No backend, database, or storage service is required.

## Assumptions

- The first version serves one fictional user and uses English text.
- The three task names, their order, and the total count are fixed.
- All tasks contribute equally to preparation progress.
- Confirmed presentation choices: whole-number percentages (0%, 33%, 67%, 100%), a visible progress bar, and a bold fantasy training theme.
- Task completion is self-reported; no external verification is needed.

## Limitations

- Saved progress is specific to the browser and site address. Clearing site data, private browsing, or blocked browser storage can remove or prevent saved progress.
- Progress is not shared between devices, browsers, or users.
- The dashboard measures only how many predefined tasks are marked complete; it does not measure training quality, time spent, or combat readiness.
- Users cannot customise the task list in this version.

## Explicitly excluded features

- Login, accounts, user profiles, and authentication.
- Databases, cloud storage, and device synchronisation. Browser localStorage is included by user request on 16 October 2026.
- Payments, subscriptions, or purchases.
- Chatbots, AI coaching, and generated training plans.
- Combat simulation or predictions about defeating Lucifero.
- Additional screens or routes.
- Creating, editing, deleting, or reordering tasks.
- Subtasks, editable priorities, priority-based sorting or weighting, deadlines, reminders, and notifications.
- Training notes, attachments, search, filters, and task categories.
- Team collaboration, sharing, leaderboards, and social features.
- Historical reports, streaks, achievements, and analytics dashboards.

