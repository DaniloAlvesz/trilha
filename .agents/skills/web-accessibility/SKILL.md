---
name: web-accessibility
description: Review and improve web interfaces for WCAG 2.2 accessibility, mobile reflow, keyboard use, clear forms, and low digital literacy. Use for requested accessibility audits or UI changes that need this review.
---

# Web accessibility review

This is a locally authored Codex skill based on public W3C guidance. It is not an official W3C skill, endorsement, or certification. The repository https://github.com/w3c/wcag maintains the standard and supporting documents; it is not a ready-to-install skill package.

## Evidence and scope

Use the published [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) as the normative reference. Distinguish criterion failures established by inspection or testing from likely risks that still require a browser or assistive-technology test. Give the file or screen, actual behavior, relevant criterion, and a concrete correction. Do not claim complete conformance after only automated tests or source review.

Preserve the user's product, audience, visual direction, and authorized scope. A feminine palette can still have strong contrast and inclusive copy. Do not replace requested functionality with a disclaimer when it can be made understandable and accessible.

## Focused review

- **Reflow and reading:** test core tasks at 320 CSS pixels and with enlarged text. Check long user-generated titles, form controls, grids and fixed navigation for horizontal overflow or clipped actions (1.4.4, 1.4.10, 1.4.12). Do not shrink navigation text to cancel the user's text-size setting.
- **Contrast:** measure actual foreground/background pairs, including selected, error and focus states. Target 4.5:1 for normal text and 3:1 for large text; required control boundaries and meaningful graphics need 3:1 against adjacent colors (1.4.3, 1.4.11). Color alone must not carry status or selection (1.4.1).
- **Keyboard and focus:** verify the main tasks with keyboard, a visible focus indicator, logical order and no trap. Fixed notices and bottom bars must not entirely hide the focused control (2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11). Restore focus sensibly after deleting an item or closing an expanded task.
- **Names and structure:** use real buttons, links, labels, headings and fieldsets. Icon-only actions need an accessible name. Disclosure controls expose expanded state; mutually exclusive choices should be clear as such. Navigation indicates the current page (1.3.1, 2.4.4, 2.4.6, 4.1.2).
- **Touch targets:** check WCAG 2.2 target size or spacing requirements (2.5.8). For an audience with low digital familiarity or motor difficulties, prefer approximately 44–48 CSS pixel controls where practical; this recommendation is stronger than the AA minimum and is not itself an AA claim.
- **Forms:** put necessary instructions before or beside the task. Identify missing or invalid inputs in text, associate errors with the affected fields or groups, preserve entered data, and provide a way to correct the issue (3.3.1, 3.3.2, 3.3.3). Consider moving focus to the first invalid field or an error summary when it prevents confusion.
- **Feedback:** expose successful saves and result changes without forcing users to discover the change visually (4.1.3). Do not rely on fleeting toasts as the only error explanation. Avoid excessive repeated live announcements.

## Clear language

Use [WAI Clear Words](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/) and [Step-by-step Instructions](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/) to simplify labels, tasks, examples and errors. These are supplemental cognitive accessibility guidance, not additional normative WCAG success criteria. Prefer familiar verbs, one main action per task, visible labels and short instructions. Explain technical terms at the point of use.

## Verification output

Report what was inspected, what was changed, which checks passed, and what remains untested. A useful final review states browser/viewport coverage and any remaining manual screen-reader, keyboard or clinical-content review. Never invent a score, certification or assistive-technology test result.
