# Submission controls and dark dashboard update

- Admin can set independent group-work and individual-task deadlines.
- Both submission types have separate open/close toggles; the API rejects new submissions for a closed type or an expired deadline.
- All visitors see live countdown cards and closure status.
- Admin password change is stored in Netlify Blobs as a SHA-256 hash and requires the current password plus an active admin session.
- Group submissions save `learnerScores` for every group member, automatically assigning each member the group mark. Scores are refreshed when an admin edits the group mark or members.
- Dashboard uses a darker navy theme with contrasting cards and controls.

Deploy this project to Netlify with Blobs enabled. Keep `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and especially `JWT_SECRET` configured securely in Netlify environment variables; use a strong unique `JWT_SECRET`. If `ADMIN_PASSWORD` is configured in Netlify, the initial password is that value; otherwise it defaults to the existing app default. Once changed through the panel, the stored password is used for login.
