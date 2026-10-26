# RepFinds Hub — Locked Affiliate Overhaul & Raided Agent Protection

This update replaces every spreadsheet product link and signup banner with your exact referral links across 12 verified Chinese shopping agents—led by **CNShopper** as the default primary agent—while removing raided or underperforming agents from all purchase flows and warning visitors against them in the Agent Safety & Comparison Guide.

## User Review & Critical Decisions

> [!IMPORTANT]
> All confirmed choices from our clarification step are locked into this plan:

- **Confirmed Decision 1 (Raided & Blacklisted Agents)**: **Mulebuy**, **ACBuy (AllChinaBuy)**, **CNfans**, **Hoobuy**, and **Joyagoo (Joyabuy)** are completely removed from all product buy buttons and agent selectors. They appear in a dedicated **"Raided & Avoid Blacklist"** section inside the Agent Comparison Guide with red warning badges so buyers immediately switch to your safe agents.
- **Confirmed Decision 2 (Permanent Referral Locking)**: Your referral codes and signup links are hardcoded and permanently locked for all visitors. The public affiliate editor is removed, and any previously cached referral codes in browser storage are automatically overwritten with your exact referral parameters.
- **Confirmed Decision 3 (Referral Buy + Signup Popup Flow)**: Clicking **Buy** on any spreadsheet item converts the underlying Weidian/Taobao/1688 URL using your referral code and opens a quick **Bonus & Checkout Action Modal** where users can claim your signup coupon bundle first (e.g., CNShopper 20% Off + $400 Coupons), auto-copy the raw product link if needed, or jump straight to the converted agent item page.

---

## 1. Overview & Core Concept

- **What It Does**: Dynamically ingests all 9 category tabs from the Google Sheet (`Clothes`, `Shoes`, `Wallets & Bags`, `Belts`, `Jewelry`, `Room & Living`, `Electronics`, `Gym & Sports`, `Glasses & Eyewear`), strips out the original sheet owner's Oopbuy code (`29TOTHGNH`), and rewrites every single item and registration link with your 12 affiliate referral codes.
- **Target Audience / Persona**: Rep community buyers looking for safe, non-raided warehouses with high-value shipping coupon bundles and verified QC photos.
- **Key Value**: Maximizes your affiliate conversions and signups by steering traffic away from raided agents toward **CNShopper** and your 11 other partner platforms.

### Locked Affiliate Roster

| Priority | Agent Name | Locked Referral / Invite Parameter | Registration URL | Featured Bonus |
| :--- | :--- | :--- | :--- | :--- |
| **#1 Default** | **CNShopper** | `invite_id=2554628` | `https://cnshopper.com/?invite_id=2554628` | **20% Off Coupon + $400 Coupon Pack (Best Warehouse)** |
| **#2** | **StarGobuy** | `invite_id=10768` | `https://stargobuy.com?invite_id=10768` | **New Fast Agent — Exclusive Signup Bonus** |
| **#3** | **Oopbuy** | `inviteCode=4MPOITBZV` | `https://m.oopbuy.com/pages/register/index?inviteCode=4MPOITBZV` | **30% Off Shipping + Native Sheet Support** |
| **#4** | **Superbuy** | `partnercode=ENOQZo` | `https://m.superbuy.com/en/register/index?partnercode=ENOQZo` | **$85 Veteran Agent Bonus Vouchers** |
| **#5** | **LoveGoBuy** | `invite_code=KSPMEY` | `https://www.lovegobuy.com/?invite_code=KSPMEY` | **Shipping Discount Bundle + Fast QC** |
| **#6** | **Sugargoo** | `memberId=3161295250700719145` | `https://m.sugargoo.com/register?memberId=3161295250700719145` | **¥280 Tax-Free Shipping Coupon Pack** |
| **#7** | **Boonbuy** | `inviteCode=PQNPT7D42` | `https://m.boonbuy.com/pages/register/index?inviteCode=PQNPT7D42` | **New User Shipping Voucher Bundle** |
| **#8** | **Hipobuy** | `inviteCode=WIIX4MNYG` | `https://m.hipobuy.com/pages/register/index?inviteCode=WIIX4MNYG` | **Fast Dispatch + Signup Coupon Pack** |
| **#9** | **Litbuy** | `inviteCode=KY6TU3BGB` | `https://m.litbuy.com/pages/register/index?inviteCode=KY6TU3BGB` | **Zero Brand Restrictions + Welcome Pack** |
| **#10** | **GTBuy** | `inviteCode=5S4W9BL4K` | `https://m.gtbuy.com/pages/register/index?inviteCode=5S4W9BL4K` | **Discounted Express Lines + Signup Pack** |
| **#11** | **LoloBuy** | `inviteCode=3w5ja` | `https://m.lolobuy.com/index?inviteCode=3w5ja` | **Low Exchange Markup + Coupon Pack** |
| **#12** | **Rizzitgo** | `rno=199196` | `https://m.rizzitgo.com/?rno=199196` | **Fast Warehouse Processing + Bonus** |

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Default Landing Experience**: Visitors land with **CNShopper** pre-selected as the #1 recommended agent. The hero banner prominently highlights **CNShopper's 20% Coupon + $400 Coupon Bundle** with a direct registration CTA (`https://cnshopper.com/?invite_id=2554628`) and a secondary quick-link to **StarGobuy** (`https://stargobuy.com?invite_id=10768`).
  2. **Buy + Signup Conversion Popup**: Clicking **Buy with [Agent]** on any card opens a streamlined conversion modal that:
     - Displays the item title, price, and converted referral destination.
     - Provides a prominent **"Step 1: Sign Up on [Agent] for $400 Coupons"** button using your exact registration URL.
     - Provides a **"Step 2: Continue to Product Page"** button (with auto-copied raw Weidian/Taobao link so users can also paste it directly into the agent's search bar if redirected to registration).
     - Includes a "Don't show this reminder again, open product directly" checkbox for repeat buyers.
  3. **Agent Safety & Comparison Matrix**: Accessible from the top bar and hero banner. Splits agents into two clear sections:
     - **Verified Safe Agents (12 Active Partners)**: Ranked with your locked signup links, bonus details, and 1-click "Set as Active Agent" buttons.
     - **Raided & Blacklisted Agents (DO NOT USE)**: Displays **Mulebuy (RAIDED)**, **ACBuy (RAIDED & BAD)**, **CNfans (RAIDED)**, **Hoobuy (BAD & EXPENSIVE)**, and **Joyagoo / Joyabuy (BAD)** with crimson alert indicators and a recommendation to migrate hauls to **CNShopper**.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-contrast dark streetwear catalog and high-density data grid.
  - *Color Palette & Mood*: Deep zinc canvas (`#09090B`), charcoal structural surfaces (`#18181B`), warm amber gold (`#F59E0B`) for primary conversion CTAs, emerald (`#10B981`) for verified status and tabular pricing, and crimson (`#EF4444`) strictly for raided agent warnings.
  - *Typography & Hierarchy*: `Plus Jakarta Sans` for crisp navigation and product titles, paired with `JetBrains Mono` (`tabular-nums`) for USD/CNY pricing, parcel weights, and referral codes.
  - *Component Styling & Layout*: 1440px desktop container baseline with 5-column responsive product grid, single-elevation cards, unboxed metadata with middle-dot (`·`) separators, and single-line controls.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server + Client Referral Sanitization**
  - *Chosen Approach*: Strip the original spreadsheet's `inviteCode=29TOTHGNH` during HTML parsing and dynamically inject your locked referral codes on every product URL and registration link.
  - *Why*: Ensures zero leakage of the original spreadsheet creator's affiliate code even if a user inspects raw links or exports a CSV haul manifest.
- **Decision 2: Combined Direct Deep-Link + Auto-Copy Fallback in Buy Modal**
  - *Chosen Approach*: For agents with direct item deep-linking (Oopbuy, Boonbuy, Hipobuy, Litbuy, GTBuy, Superbuy, Sugargoo, LoveGoBuy, CNShopper, StarGobuy, LoloBuy, Rizzitgo), construct the affiliate product URL and simultaneously copy the raw Taobao/Weidian URL when opening the Signup/Buy modal.
  - *Why*: New users who click your registration link first often land on the agent's home dashboard after creating an account; having the item link already copied to their clipboard lets them immediately paste and purchase under your affiliate account.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Google Sheet Live Source (9 Tabs)                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTML Fetch & Cache (/api/sheet-data)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│             Sheet Parser & Referral Sanitizer (Server & Client)         │
│   • Extracts Weidian / Taobao / 1688 Item IDs, QC Links, Prices         │
│   • Strips original sheet owner code (29TOTHGNH)                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 Locked Affiliate Engine (12 Active Agents)              │
│   • Default: CNShopper (invite_id=2554628)                              │
│   • StarGobuy, Oopbuy, Superbuy, Sugargoo, LoveGoBuy, Boonbuy,          │
│     Hipobuy, Litbuy, GTBuy, LoloBuy, Rizzitgo                           │
│   • Blacklist Registry: Mulebuy, ACBuy, CNfans, Hoobuy, Joyagoo         │
└───────┬────────────────────────────┬────────────────────────────┬───────┘
        │                            │                            │
        ▼                            ▼                            ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐
│  Header & Hero Promo │  │  Product Catalog &   │  │ Agent Safety Matrix │
│  • CNShopper $400    │  │  Referral Buy Modal  │  │ • 12 Verified Links │
│    Coupon Callout    │  │  • Signup + Buy Flow │  │ • 5 Raided Warnings │
│  • Agent Switcher    │  │  • Auto-Copy Raw URL │  │ • Haul Drawer Sync  │
└──────────────────────┘  └──────────────────────┘  └─────────────────────┘
```

### Interactive Component & State Mapping

- **Locked Agent State Initialization**: On load, the app validates `localStorage.getItem('repfinds_selected_agent')`. If it is empty or matches any removed/raided agent (`mulebuy`, `allchinabuy`, `cnfans`, `hoobuy`, `joyabuy`), it automatically resets to `'cnshopper'`.
- **Referral Buy & Signup Modal**: Triggered when a user clicks the primary buy button on any product card or table row. Displays the active agent's locked signup link and bonus alongside the direct product link, plus a toggle to bypass the modal on subsequent clicks once registered.
- **Agent Safety & Comparison Modal**: Renders the 12 verified agents at the top with your locked registration links, followed by a crimson warning table listing the 5 raided/bad agents and why users must avoid them.
