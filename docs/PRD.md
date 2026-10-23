# Asta’s Preparation Dashboard

## Summary

- **Purpose:** Give Asta one place to track Sword control, Physical endurance, and Team coordination as he prepares for Lucifero.
- **How it works:** Check off a task or undo it, see your progress change, and return after a refresh without losing it.
- **Progress:** Each task counts equally. Divide completed tasks by three, multiply by 100, and round to a whole number.
- **Status:** The dashboard is built, with no accounts or database. The test results and Muhammad’s experience are in [REVIEW.md](REVIEW.md).

This is a learning project based on a fictional character. Muhammad tried the site, as described in [REVIEW.md](REVIEW.md#user-testing--muhammad). Wider user research is outside the assignment.

## Primary user and problem

**Primary user:** Asta, a fictional fighter preparing for Lucifero.

**Problem:** Asta’s training notes are scattered. He needs one place to see what he has finished, what still needs work, and how much of his plan is complete.

## Goal of the first version

The first version should make the three tasks easy to read and use. Asta should be able to complete or undo any task and see the count and percentage update straight away.

The checklist below defines what needs to work. The percentage shows how much of the training plan is complete; it cannot tell us whether Asta can defeat Lucifero.

## Core features

The dashboard has three main features:

1. **See the tasks:** Show Sword control, Physical endurance, and Team coordination together, with a clear status for each.
2. **Complete or undo a task:** Let Asta change any task as often as he needs.
3. **Track progress:** Keep the completed count, percentage, and progress bar in step whenever a task changes.

## User stories

- As Asta, I want to see all my training tasks in one place so I know what to work on.
- As Asta, I want to mark a task complete so I can track what I have finished.
- As Asta, I want to undo completion so I can correct a mistake or revisit training.
- As Asta, I want to see my completed task count and preparation percentage so I can understand my progress at a glance.
- As a keyboard user, I want to operate every completion control without a mouse.

## Sample data and expected behaviour

These are the three tasks, shown in this order:

| ID | Task | Description | Priority | Initial completion | Initial status text |
| --- | --- | --- | --- | --- | --- |
| sword-control | Sword control | Practise precise anti-magic sword movements. | High | false | Incomplete |
| physical-endurance | Physical endurance | Complete a focused strength and stamina session. | Medium | false | Incomplete |
| team-coordination | Team coordination | Review a preparation plan with the Black Bulls. | High | false | Incomplete |

All three tasks count equally. Their names, descriptions, order, and priorities are fixed. A High priority task contributes the same amount of progress as a Medium priority task.

**Calculation:** Divide the number of completed tasks by three, multiply by 100, and round to the nearest whole number. Recalculate from the checked tasks each time so the total stays accurate.

| Completed tasks | Visible count | Preparation percentage |
| --- | --- | --- |
| 0 | 0 / 3 completed | 0% |
| 1 | 1 / 3 completed | 33% |
| 2 | 2 / 3 completed | 67% |
| 3 | 3 / 3 completed | 100% |

- With no saved progress, every task starts incomplete, with 0 / 3 completed and 0%.
- Completing Sword control changes only that task to Complete and updates the summary to 1 / 3 completed and 33%.
- Completing Physical endurance next updates the summary to 2 / 3 completed and 67%.
- Completing Team coordination next updates the summary to 3 / 3 completed and 100%.
- Undoing Sword control at that point returns its status to Incomplete and updates the summary to 2 / 3 completed and 67%.
- Tasks can be checked or unchecked in any order without leaving or reloading the page.
- localStorage remembers completion after a refresh. A new browser starts with no tasks complete. If saved data is invalid or saving is blocked, show a warning and keep the tasks usable.

## Acceptance criteria

- [ ] The dashboard shows its name and the three tasks in the order above.
- [ ] With no saved data, all tasks are incomplete and the summary shows 0 / 3 completed and 0%.
- [ ] Each task has its own checkbox and clearly says Complete or Incomplete.
- [ ] Completing any one task updates its status, the count to 1 / 3 completed, and the percentage to 33% immediately.
- [ ] Completing any two tasks shows 2 / 3 completed and 67%; completing all three shows 3 / 3 completed and 100%.
- [ ] Undoing a completed task immediately recalculates the count and percentage using the remaining completed tasks.
- [ ] Toggling the same task twice restores its original state and the original summary values without changing other tasks.
- [ ] The progress bar matches the displayed percentage, including empty at 0% and full at 100%.
- [ ] Tab reaches every checkbox, Space changes it, and keyboard focus is easy to see.
- [ ] At 320 CSS pixels wide, text and controls are readable and usable without scrolling sideways.
- [ ] Status makes sense without colour, and assistive technology can read each task name and whether it is checked.
- [ ] A screen reader can announce progress changes without interrupting the user or moving keyboard focus.
- [ ] Refresh restores completed and undone tasks and recalculates the count and percentage. Blocked or malformed storage does not crash the dashboard.
- [ ] The app uses Next.js, TypeScript, and Tailwind CSS and stays within the scope below.

## Design and accessibility requirements

- Use an Asta-inspired fantasy theme with strong headings, dark panels, and bright accents. Keep tasks and progress easy to read over any artwork.
- Follow a clear reading order: dashboard title, preparation summary, then the three tasks.
- Keep the count and percentage visible as text alongside the progress bar. Label the summary “Preparation progress.”
- Stack the content on small screens, leave enough space between items, and make each checkbox target at least 44 × 44 CSS pixels.
- Use native checkboxes with visible task labels. Checked means complete; unchecked means incomplete.
- Make keyboard focus visible, keep the tab order logical, and leave focus on the checkbox after it changes.
- Use proper headings and a task list. Give the progress bar a name and current, minimum, and maximum values that assistive technology can read.
- Announce the updated count and percentage through a polite live region.
- Meet WCAG AA contrast targets: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for essential control boundaries and state indicators.
- Show completion through text and the checkbox as well as colour. Keep completed task names readable, even if they are struck through.
- Show “Progress is saved in this browser.” when saving works, and a clear warning when browser saving is unavailable. No animation is required.

## Stack

- **Next.js:** Runs the dashboard page.
- **TypeScript:** Describes the task data and completion state.
- **Tailwind CSS:** Handles styling and layouts for different screen sizes.
- **React and localStorage:** Update tasks on screen and save completed task IDs in the browser.

## Assumptions

- The first version serves one fictional user and uses English text.
- The three task names, their order, and the total count are fixed.
- All tasks contribute equally to preparation progress.
- Progress uses whole numbers (0%, 33%, 67%, 100%) and a visible bar within the fantasy theme.
- Users decide when a task is complete; the app does not check their training.

## Limitations

- Progress belongs to the browser and site address where it was saved. Clearing site data, using private browsing, or blocking storage can stop it from being remembered.
- Progress is not shared between devices, browsers, or users.
- The percentage counts finished tasks. It does not measure training quality, time spent, or combat readiness.
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


## Character cards added by request (16 October 2026)

The requested character cards show Lucifero and Asta with short descriptions and notes that can be opened or closed. They sit beside the plan on desktop and below it on mobile. This updates the earlier idea of keeping Lucifero only in the header. The same three training tasks remain the focus.

An AI-restored copy of the supplied background may be used to improve clarity. Explain that change in the design notes and keep the original file.
