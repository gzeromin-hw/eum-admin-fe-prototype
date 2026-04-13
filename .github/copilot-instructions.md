# EUM Admin UI Rules

## Visual Direction

- This project uses a squared, sharp-corner UI style.
- Prefer straight edges over soft cards.
- Avoid overly rounded visuals across layout and controls.

## Corner Radius Rules

- Default containers and sections: use no radius or small radius only.
- Inputs, buttons, and cards: avoid pill or full-round styles.
- Do not introduce decorative large-radius blocks unless explicitly requested.

## Component Usage Guidance

- Keep corner radius consistent across related components on the same screen.
- If an existing component has large radius, override with project-appropriate classes when used in new pages.
- Prioritize consistency over visual novelty.

## PR/Review Checklist

- Are primary containers squared enough for this design system?
- Are there any pill-shaped or over-rounded elements that break consistency?
- Is radius usage consistent between desktop and mobile layouts?
