

## Plan: Enhance Landing Page with Extended Roadmap, Line Chart, Recommendation Panel, Referral Guide, and FAQ Minibot

### 1. Expand Roadmap to 6 Milestones
**File:** `src/components/RoadmapSection.tsx`

Add 3 more milestones to the existing 3:
- Now: Early Access Waitlist (active)
- March 2026: Community Building
- June 2026: Alpha Testing
- August 2026: Beta Launch
- October 2026: Creator Tools
- November 2026: Full Launch

### 2. Replace Bar Chart with Line Chart
**File:** `src/components/SocialProofSection.tsx`

Replace the custom bar chart with a Recharts `LineChart` using the existing `recharts` dependency. Show weekly signup growth as a smooth line with gold gradient fill underneath. Keep the stats cards above.

### 3. Add Recommendation Panel
**File:** Create `src/components/RecommendationSection.tsx`

A form where users can submit a recommendation/suggestion for the platform:
- Name field (optional)
- Email field (required)
- Recommendation textarea (required)
- Submit button with success toast confirmation
- On submit: show a success state with a simulated "confirmation email sent" message via `sonner` toast

Since there's no backend connected, the form will show a polished success state and confirmation toast. No actual email sending (would require Lovable Cloud).

### 4. Update Referral Section with Step-by-Step Guide
**File:** `src/components/ReferralSection.tsx`

Replace the current simple copy-link section with a 3-step visual guide:
1. Join the waitlist at waitlister.me
2. Copy your unique referral link from your Waitlister dashboard
3. Share with friends to move up the queue

Keep the copy-link for the main waitlist URL.

### 5. Add FAQ Minibot
**File:** Create `src/components/FAQBot.tsx`

A floating chat-style widget (bottom-right corner) that:
- Shows a small gold chat icon button
- Opens a mini panel with pre-set FAQ questions as clickable chips
- Displays answers inline when a question is tapped
- Questions cover: "What is Pantero?", "When does beta launch?", "Is it free?", "How do referrals work?", "What skills are covered?", "How is this different?"
- Pure client-side, no AI API needed

### 6. Integrate All New Components
**File:** `src/pages/Index.tsx`

Add `RecommendationSection` after `EarlyAccessSection`, and add `FAQBot` as a floating component. Update imports.

### Technical Notes
- Line chart uses existing `recharts` dependency
- Toast notifications use existing `sonner`
- FAQ bot is a self-contained component with hardcoded Q&A pairs
- No backend/API needed for any of these changes

