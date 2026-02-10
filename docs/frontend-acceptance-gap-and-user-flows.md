# Frontend Acceptance Plan: Gap Analysis + Complete User Flows

## Source Docs Used
- `/Users/abhishekmankotia/Downloads/Private & Shared 4/MVP Development Scope 2fbb66b9870080b39b9ef35cd8add0f6.md`
- `/Users/abhishekmankotia/Downloads/Private & Shared 5/Features 2fbb66b987008164ace9e14a878f0290.md`

## Current Frontend Baseline (As-Built)
The current app already contains substantial interactive UI in:
- onboarding/sign-in
- vault (upload + consent cards + usage ledger UI)
- discover/search, feed, network, chat
- contracts, settings, actor/studio/agency profile pages

Primary limitation: many features are represented with mock data/UI only and do not yet satisfy the complete acceptance criteria in the two docs.

---

## Gap Matrix (Requirement vs Current vs Missing)

### 1) Route + IA Gaps
| Requirement | Current | Gap |
|---|---|---|
| Feature doc routes: `/vault`, `/search`, `/feed`, `/network`, `/studio/:id`, `/contracts`, `/chat`, `/settings` | App routes are under `/dashboard/*` only (`src/App.tsx`) | Add canonical route aliases and deep-link parity to match docs exactly |
| Global search entrypoint | Search is dashboard nav only | Add global search entry in top-level shell/public-to-auth transition |

### 2) MVP Phase 1 Actor Features
| Requirement | Current | Gap |
|---|---|---|
| Cast ID verified profile (identity + professional verification + role type) | Multi-step onboarding exists (`src/pages/Onboarding.tsx`) | No explicit identity-doc flow states (submitted/rejected/approved), no audit timeline |
| Consent matrix (granular + revocable: voice, likeness, training/generation, use cases, territory, duration) | Consent cards + revoke/restore modal exist (`src/pages/dashboard/VaultPage.tsx`) | Missing editable granular controls per use case/territory/duration and training vs inference split controls |
| Digital asset vault upload tied to consent | Drag-drop upload + consent-linked checks exist (`src/pages/dashboard/VaultPage.tsx`) | Missing required asset previews (audio/3D), metadata tagging, visibility control (Private/Public/Request Only), headshot uploads |
| Use ledger transparency | Ledger list + modal details exist (`src/pages/dashboard/VaultPage.tsx`) | Missing actor-side “flag suspicious use” workflow + dispute state timeline |

### 3) MVP Phase 1 Studio Features
| Requirement | Current | Gap |
|---|---|---|
| Studio account creation + paid access | Role selection exists in onboarding | No studio-specific onboarding checklist, paid plan gating, checkout flow |
| Pre-cleared talent discovery + filter by allowed use/geography | Discover/search pages exist | Missing clearance filters, legal-permission facets, geography facets aligned to consent |
| Permission-based digital asset access + auto logging | Actor profile has “Request Access” modal | Missing full request lifecycle states (requested/approved/expired/revoked) and explicit log linkback |
| Synthetic Performance License auto-generated + exportable | Contracts page includes download button + clause highlights | Missing dedicated “license generated from consent matrix” flow and certificate center |

### 4) Platform / Social Gaps
| Requirement | Current | Gap |
|---|---|---|
| Global search actors/studios/agencies with verified context | Discover/Search UIs exist | Discover lacks required NLP search + advanced filters/match score/casting list bookmark flow |
| Messaging actor↔studio, actor↔actor, studio↔agency | Rich chat UI exists (`src/pages/dashboard/ChatPage.tsx`) | No explicit studio↔agency starter flow and no permission-aware conversation initiator from key pages |
| Home feed + groups | Feed + community pages exist | Missing trending topics and who-to-follow widgets from feature doc |
| Payment rails (studio → platform → actor, fee split, invoicing/payout records) | Not implemented | Entirely missing as front-end journey |
| Trust loop (rules → usage → visible record) | Partially represented in vault | Missing cross-page journey continuity and explicit trust-loop confirmations |

### 5) Features Doc: Page-Specific Gaps

#### `/vault`
- Missing: per-asset visibility toggle (`Private/Public/Request Only`)
- Missing: metadata tagging (manual + AI-suggested)
- Missing: audio and 3D preview widgets
- Missing: explicit union status badges (CINTAA/Equity)
- Missing: consent expiry date picker UI and use-case matrix editor

#### `/search`
- Missing: natural-language query mode UX and confidence explanation
- Missing: facets for clearance status, age range, gender, accent, location
- Missing: match score in cards
- Missing: quick bookmark to named casting list

#### `/feed`
- Present: post create, comments, likes, media embedding
- Gap: explicit repost flow/state
- Gap: trending topics widget
- Gap: who-to-follow widget

#### `/network`
- Present: requests accept/ignore, my network list
- Gap: required tabs for `Casting Directors`, `Talent`, `Agents`

#### `/studio/:id`
- Present: hero/stats/featured projects area
- Gap: explicit trust score surfaced and explained
- Gap: featured projects **carousel** behavior
- Gap: “Open Operations” link to active casting calls

#### `/contracts`
- Present: contract list + AI highlight modal
- Gap: required status taxonomy `Active/Pending/Expired`
- Gap: license certificate generation center UX
- Gap: usage log ledger in contracts context

#### `/chat`
- Present: highly interactive inbox/thread/search/archive/attachments/referenced assets
- Gap: no real transport simulation state beyond local mock (acceptable for frontend MVP if mocked, but needs explicit connection/error/retry states per acceptance)

#### `/settings`
- Present: plan cards, security toggles, notification toggles
- Gap: billing history + downloadable invoices UI
- Gap: session management (`Log out all devices`)
- Gap: channel-level notification matrix (Email vs Push per event)
- Gap: checkout flow modeled as Razorpay-style stepper

### 6) Cross-Cutting Quality Gaps
- Duplicate `addLicenseRequest` method in `src/lib/store.ts`.
- Hardcoded/legacy mock comments and inconsistent flow wiring in `src/pages/dashboard/ActorProfilePage.tsx`.
- Broken/legacy links to `/dashboard/messages?...` in `src/pages/dashboard/NetworkPage.tsx` while route is `/dashboard/chat`.
- `src/pages/dashboard/SearchPage.tsx` exists but app route points `/dashboard/search` to `DiscoverPage`; IA is split and should be unified.

---

## Full End-to-End User Flows Needed for Acceptance (Frontend-Only)

## Actor Journeys

### A1. Actor Sign-Up to Verified Cast ID
**Goal:** Actor gets verified Cast ID and lands in dashboard.
1. Actor opens onboarding.
2. Enters name/email/password.
3. Selects role = Actor.
4. Completes identity verification step (front-end simulated states: `uploading`, `submitted`, `review`, `approved`, `rejected`).
5. Completes professional verification (IMDb/union ID input).
6. Sees verification confirmation screen with Cast ID badge + verification timestamps.
7. Redirect to dashboard with onboarding-complete toast.
8. Actor can view verification status panel in profile and vault.

**Edge States:** invalid doc type, verification pending, rejected with reason, resubmission.

### A2. Actor Public Profile Completion
**Goal:** Actor publishes discoverable public profile.
1. Actor opens profile setup.
2. Adds role type, location, bio.
3. Uploads headshots.
4. Adds work links (IMDb, showreel links).
5. Adds intro video URL.
6. Saves profile.
7. Sees profile completeness score and “Visible in Search” status.

**Edge States:** broken media URL, missing required fields, private profile toggle.

### A3. Actor Consent Matrix Initial Setup
**Goal:** Actor defines legally enforceable usage rules.
1. Actor opens `/vault` → Consent Matrix.
2. Toggles Voice/Likeness/Motion permissions.
3. Sets Training permission (`Allow AI Training` vs `Inference Only` vs `No`).
4. Selects allowed use-cases (games, TV/film, social, political, dubbing, ads).
5. Selects territory list.
6. Sets duration/expiry date.
7. Saves matrix and sees versioned policy snapshot.
8. Confirmation shows “Nothing can be used unless allowed”.

**Edge States:** conflicting rules, expired rules, unsaved changes warning.

### A4. Actor Consent Update / Revoke
**Goal:** Actor revokes or narrows rights anytime.
1. Actor opens existing policy.
2. Chooses scope (global revoke vs use-case revoke vs territory change).
3. Confirms impact modal (what active licenses are affected).
4. Saves.
5. UI marks policy as `revoked` or `conditional`.
6. Ledger and studio-facing views reflect updated policy state.

**Edge States:** active contracts prevent immediate revoke; show “effective date” scheduling.

### A5. Actor Vault Upload + Policy Binding
**Goal:** Actor uploads assets with legal controls.
1. Actor opens `/vault` upload zone.
2. Drags file (`.wav`, `.obj`, headshot image).
3. Sees auto-detected asset type.
4. Adds metadata tags (manual + AI suggestions).
5. Sets visibility (`Private`, `Public`, `Request Only`).
6. Confirms linked consent policy.
7. Upload progress pipeline completes.
8. Asset appears in vault with preview and policy badges.

**Edge States:** unsupported file, revoked consent for asset type, max size exceeded.

### A6. Actor Usage Ledger Review + Flagging
**Goal:** Actor audits usage and raises disputes.
1. Actor opens ledger.
2. Filters by project/studio/date/status.
3. Opens a usage entry detail.
4. Reviews project, territory, duration, session ID.
5. Clicks `Flag use` if suspicious.
6. Files reason + evidence in dispute modal.
7. Sees dispute status (`submitted`, `under review`, `resolved`).

**Edge States:** duplicate dispute submission, unresolved prior dispute warning.

### A7. Actor Messaging Lifecycle
**Goal:** Actor securely communicates with studios/agencies/actors.
1. Actor opens `/chat`.
2. Accepts or declines message requests.
3. Opens thread.
4. Sends text + secure attachment + optional referenced asset snippet.
5. Uses in-thread search.
6. Archives completed thread.
7. Reopens archived thread when needed.

**Edge States:** file size/type restrictions, send failure retry state, offline state.

### A8. Actor Feed and Groups Participation
**Goal:** Actor engages with community.
1. Actor opens `/feed`.
2. Creates post (text/image/link/audio/video/poll).
3. Likes/comments/reposts other posts.
4. Opens group card and joins group.
5. Creates group discussion post.
6. Tracks engagement metrics.

**Edge States:** media URL invalid, posting cooldown, comment moderation removed.

### A9. Actor Payout + Invoice View
**Goal:** Actor tracks money transparently.
1. Actor opens `Payments` section (new).
2. Views payout queue and completed payouts.
3. Opens one payment to see studio amount, platform fee, net payout.
4. Downloads invoice/receipt.
5. Views status timeline (`initiated`, `processing`, `paid`).

**Edge States:** payout hold, failed transfer, tax info missing.

### A10. Actor Security & Notification Management
**Goal:** Actor controls account security and communication channels.
1. Actor opens `/settings`.
2. Enables/disables 2FA.
3. Opens session management and logs out all devices.
4. Configures notification matrix by channel (email/push/in-app per event).
5. Saves settings and gets confirmation.

---

## Studio Journeys

### S1. Studio Signup + Verification + Paid Plan Activation
**Goal:** Studio becomes verified paid account.
1. Studio signs up and selects role = Studio.
2. Fills company profile + registration number.
3. Submits business verification docs.
4. Chooses plan (`Pro`/`Enterprise`).
5. Completes checkout flow (Razorpay-style mock front-end).
6. Sees account status `Paid + Verified`.
7. Lands in studio dashboard with unlocked features.

**Edge States:** payment failed, verification pending, incomplete profile blocking discovery features.

### S2. Discover Pre-Cleared Talent
**Goal:** Studio finds legally usable talent quickly.
1. Studio opens `/search`.
2. Uses NLP query or keyword query.
3. Applies filters: clearance status, use-case permissions, geography, demographics.
4. Reviews result cards with match score and consent summary.
5. Saves actors into named casting list.
6. Opens actor profile from results.

**Edge States:** no matches, conflicting filters, actor profile set to private.

### S3. Request Asset Access from Actor
**Goal:** Studio requests legally compliant asset use.
1. Studio opens actor profile.
2. Clicks `Request Access` on specific asset type.
3. Inputs project/use-case/territory/duration.
4. System performs front-end consent pre-check and displays pass/fail.
5. Studio submits request.
6. Request enters status pipeline (`pending actor approval`).
7. Studio can track request in contracts/projects area.

**Edge States:** consent mismatch, expired consent, actor revoked rights after request.

### S4. Generate Synthetic Performance License
**Goal:** Studio obtains exportable legal doc from approved consent.
1. Approved request appears in `Contracts`.
2. Studio clicks `Generate License`.
3. Front-end composes license summary from consent matrix + project scope.
4. Studio reviews legal clauses and highlighted risks.
5. Studio downloads PDF certificate.
6. License stored in repository with immutable version marker.

**Edge States:** missing required scope fields, consent changed before generation.

### S5. Studio Messaging + Negotiation
**Goal:** Studio negotiates with actor/agency in secure chat.
1. Studio starts conversation from actor profile or request.
2. Thread auto-includes project context card.
3. Studio shares NDA/script files.
4. Studio references target asset in thread.
5. Conversation is searchable and archivable.
6. Final agreed terms linked to contract record.

### S6. Studio Contract Repository Workflow
**Goal:** Studio manages all legal states.
1. Studio opens `/contracts`.
2. Filters contracts by status (`Active`, `Pending`, `Expired`).
3. Opens contract and reviews smart highlights.
4. Downloads source docs + generated licenses.
5. Views usage logs tied to each license.

### S7. Studio Payment Rail Workflow
**Goal:** Studio pays through transparent split.
1. Studio opens `Payments` section (new).
2. Selects payable contract/license.
3. Reviews split: gross, platform fee, net actor payout.
4. Confirms payment.
5. Sees payment status and receipt.
6. Payment appears in actor payout ledger.

### S8. Studio Profile Public Presence
**Goal:** Studio profile acts as trust + conversion surface.
1. User opens `/studio/:id`.
2. Sees verification badge + trust score + explanation.
3. Browses featured projects carousel.
4. Checks stats grid and active casting operations.
5. Clicks message/contact/open operations.

---

## Agency Journeys

### G1. Agency Onboarding + Verification
1. Agency signs up and selects role.
2. Submits credentials.
3. Receives verified badge.
4. Accesses agency dashboard views.

### G2. Agency Discovery + Representation Workflow
1. Agency searches talent/studios.
2. Builds representation shortlist.
3. Initiates intro message between actor and studio.
4. Tracks conversation and contract milestones.

### G3. Agency Collaboration in Contracts
1. Agency opens contract thread.
2. Reviews highlights with actor/studio.
3. Leaves comments and requests amendments.
4. Tracks final signed status.

---

## Platform-Wide Journeys

### P1. Global Search Across Entity Types
1. User opens global search.
2. Searches actor/studio/agency in one bar.
3. Switches entity tabs.
4. Opens verified profiles from results.

### P2. Trust Loop (Core MVP Narrative)
1. Actor sets consent rules.
2. Studio requests and uses assets only within allowed scope.
3. License generated from approved scope.
4. Usage events written to ledger.
5. Actor audits events and can flag issues.
6. Both parties see the same timeline/history.

### P3. Community + Groups
1. User browses suggested groups.
2. Joins group.
3. Posts update.
4. Interacts via comments/reposts.
5. Receives event/topic/follow suggestions.

### P4. Dispute & Resolution
1. Actor flags usage entry.
2. Case created with status timeline.
3. Studio receives dispute notification.
4. Both sides upload supporting context.
5. Case closes with result and audit record.

---

## Frontend Acceptance Criteria (Build-Ready)

## Mandatory for “Full Acceptance” Against Provided Docs
- Exact route support for all feature-doc paths.
- Full consent matrix editing controls (use cases, training/inference, territory, duration).
- Vault previews + metadata + visibility control.
- Search NLP mode + full facet set + match score + casting list bookmark.
- Feed additions: repost, trending topics, who-to-follow.
- Network category tabs (`Casting Directors`, `Talent`, `Agents`).
- Studio trust score + operations link + project carousel.
- Contracts status taxonomy + license generation center + usage logs.
- Settings additions: billing history, invoices, session management, channel-level notifications.
- Payment rails and payout/invoice front-end journeys.
- Dispute/flag workflow from ledger entries.

## Required UX States for Frontend-Only Build
For every critical action, include:
- empty state
- loading state
- success state
- error state
- blocked permission state
- confirmation modal for destructive/legal-impact actions

---

## Suggested Build Sequence (Fastest Path to Acceptance)
1. Route parity + nav cleanup (including fixing `/dashboard/messages` links).
2. Vault + consent matrix completion (largest legal core gap).
3. Discover/search completion (NLP + legal facets + match/bookmarks).
4. Studio access request → license generation flow completion.
5. Contracts taxonomy + usage logs + certificate center.
6. Payment rails UI (studio pay-in, actor payout, invoices, splits).
7. Feed/network/studio-profile/page-specific polish gaps.
8. Settings finalization (billing history/session controls/channel notifications).
9. QA pass against all flows above.

