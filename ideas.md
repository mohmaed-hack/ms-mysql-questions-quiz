# اتجاه تصميم MySQL Quiz

## Theme Name
**Midnight Lab — مختبر منتصف الليل**

## Intro
واجهة اختبار أكاديمية كبيرة وواضحة مستوحاة من شاشات مختبرات قواعد البيانات: خلفية كحلية عميقة، مساحات بيضاء مريحة، سماوي للإجراءات، وكهرماني للتقدم والنتائج.

## Design movement
Editorial academic dashboard: structured, calm, and task-focused rather than game-like.

## Core principles
- One question at a time with strong reading hierarchy.
- English-only question content exactly as extracted from the bank.
- Immediate state feedback through progress, answered state, and navigation—not answer reveal.
- Keyboard-friendly and responsive from phone to desktop.

## Color philosophy
- Navy #08111F for trust and focus.
- Slate #12233A for surfaces.
- Cyan #4DE1D0 for actions and active navigation.
- Amber #FFB84A for score, progress, and exam emphasis.
- White #F8FAFC and muted blue-gray #9DB2C7 for readable text.

## Layout paradigm
Centered quiz shell with a slim top progress rail, large question panel, answer controls, and a persistent right-side question navigator on wide screens that collapses below the question on mobile.

## Signature elements
- Eng M_saeed footer on every state.
- Circular question numbers with three states: unanswered, answered, current.
- A small “SQL BANK / PRACTICE MODE” label as product identity.

## Interaction philosophy
Every action is reversible until Submit. Ending early is supported with a confirmation that states unanswered count. The current answer is saved immediately to localStorage. Direct number navigation accepts any valid question number.

## Animation
No decorative motion; only short, reduced-motion-safe state transitions for panel changes and progress updates.

## Typography system
- UI/headings: Inter/system sans-serif.
- Question and labels: readable system sans-serif.
- SQL/code: ui-monospace.

## Brand essence
A serious, dependable practice environment for students preparing for a MySQL exam.

## Brand voice
Direct, encouraging, and precise. No fluff. English-only student-facing questions as requested.

## Wordmark/logo
A flat database cylinder paired with a cyan check mark, used as an inline SVG logo and favicon.

## Signature brand color
#4DE1D0.
