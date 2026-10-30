# Bookmark group open intro

A one-time intro in the bookmark folder modal (`src/features/widgets/bookmark/components/group-open-intro.tsx`). It teaches that a middle-click or Ctrl+click on a folder opens all its bookmarks at once, in one tab group when the tab-groups permission is granted.

**Status:** approved and built. The owner picked the coachmark (G2) placed inside the folder modal, with the permission step first.

## Boards

| File | Shows |
|---|---|
| `boards/PermissionStep.dc.html` | Step 1, shown only without the `tabGroups` permission: the picture, why the permission is needed, «فعلا نه» and «اجازه بده» |
| `boards/GuideStep.dc.html` | Step 2: the picture, the title and line, then one row with the step dots, the «کلیک وسط» and «Ctrl + کلیک» hints and «فهمیدم» |

The coachmark is 328px wide, pinned under the folder's name at the top of the modal, with its pointer toward the name. The step dots show only when there are two steps.

## Behaviour

- It shows the first time a folder modal opens.
- «اجازه بده» asks the browser for the permission and moves to step 2. «فعلا نه» moves to step 2 too, since the bookmarks still open together without a group.
- «فهمیدم» marks the intro seen, so it never shows again. Closing the modal without it shows the intro again next time.
- It is built on the shared intro system: `useFeatureIntro` in `src/context/feature-intro.context.tsx` and `Coachmark` in `src/components/ui`. The next feature intro reuses both.

## Art

`assets/group-open.webp` comes from `art/group_open.py`, a PhotoCraft script that uses the helpers in `../pro-tab/art/common.py`. See `../pro-tab/README.md` for how to run it.
