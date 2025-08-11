## Product: Australian Student Wealth Builder

### Purpose
Help Australian students estimate realistic living expenses and build a simple, rules-based monthly allocation strategy (emergency fund, investments, flexible spend), with optional goal-based saving.

### Target Users
- **Domestic/International students**: budgeting on limited income
- **Early-career youth**: similar needs to students

---

## App Structure

### Tabs
- **Expense Calculator**
  - City selection (Sydney, Melbourne, Brisbane [default], Perth, Adelaide, Regional)
  - Main sliders: Accommodation, Food, Transport
  - Optional preset expenses (toggle + slider): Phone, Internet, Utilities, Clothing, Entertainment, Health, Gym, Study, Insurance, Subscriptions, Emergency Buffer
  - Custom expenses list (name + weekly amount, add/remove)
  - Expense summary: Weekly, Monthly, Annual
  - CTA: “Use This Amount for Wealth Strategy”
- **Wealth Strategy**
  - Income input: amount + frequency (weekly/fortnightly/monthly/annual)
  - Derived: Monthly and Annual income
  - Emergency fund status: starting balance input + progress vs. 6 months of expenses
  - Big goal (toggle): name, target amount, target date; monthly required + feasibility hint
  - Fixed expenses display (read-only from Expenses tab) + “Adjust Expenses” shortcut
  - Allocation breakdown: Fixed, Emergency, Big Goal (if on), Core (VAS/VGS), Satellite (BTC ETF), Flexible
  - Pie chart visualization (Chart.js)
  - Recommended apps/tools cards
  - Expected outcomes: Year 1 and Year 3 (with growth assumption)
  - Definitions glossary (12 key concepts)

---

## High-level Requirements

### Functional
- **City presets**: Adjust main expense sliders based on city selection.
- **Expense calculation**
  - Real-time weekly total from main + enabled preset + custom expenses.
  - Convert to monthly (round(weekly × 52 / 12)) and annual (weekly × 52).
- **Income handling**
  - Convert input to monthly basis from selected frequency.
  - Display monthly and annual income.
- **Emergency fund**
  - Show target = 6 months of monthly expenses.
  - Progress bar shows % funded from user-provided starting balance.
  - Monthly allocation = (target - starting balance) / 12 months if not fully funded.
- **Big goal**
  - If enabled, compute required monthly savings = round(target / months_until_date).
  - Feasibility hint relative to remaining income thresholds.
  - Goal allocation is deducted from flexible spending before calculating remaining flexible amount.
- **Allocation logic (monthly)**
  - Fixed = monthly expenses.
  - Remaining = max(0, monthly income − fixed).
  - Emergency fund target = 6 × monthly expenses.
  - Emergency allocation = max(0, (emergency fund target - starting emergency fund) / 12) if not fully funded.
  - Big goal = monthlyRequired when enabled (calculated from target amount / months until date).
  - Core = 10% of remaining.
  - Satellite = 3% of remaining.
  - Flexible = Remaining - Emergency allocation - Big goal - Core - Satellite.
  - Update amounts and percentages of total monthly income.
- **Visualization**
  - Render pie chart; include Big goal slice only when active with >0 allocation.
- **Expected outcomes**
  - Year 1: 12× monthly allocations (Emergency, Investments, Big goal).
  - Year 3: 36× monthly; investments grown by ~22.5%.
- **Persistence**
  - Auto-save and restore via localStorage: city, expenses, income, emergency fund, big goal.
- **Navigation**
  - Tab switching with state retention.
  - “Use This Amount” jumps to Wealth tab.

### Non-functional
- **Usability**: Instant updates; clear defaults (Brisbane, baseline sliders).
- **Accessibility**: Keyboard focus, accordions, visible focus rings.
- **Responsive**: Mobile-first layouts, grids collapse on narrow screens.
- **Performance**: No backend; only client-side logic and localStorage.
- **Theming**: Light/dark via OS or data attribute; consistent tokens.
- **Privacy**: No network persistence; local-only data.

---

## Data Model (client state)
- **selectedCity**: string
- **expenses**:
  - accommodation: number (weekly)
  - food: number (weekly)
  - transport: number (weekly)
  - presetExpenses: { [name]: number (weekly) }
  - customExpenses: Array<{ name: string, amount: number (weekly) }>
- **totalWeeklyExpenses**: number
- **monthlyIncome** / **annualIncome**: number
- **startingEmergencyFund**: number
- **bigGoal**:
  - enabled: boolean
  - name: string
  - amount: number
  - date: ISO string
  - monthlyRequired: number
- **allocations (monthly)**:
  - fixed, emergency, bigGoal, core, satellite, flexible: number

---

## Business Rules and Calculations
- **Monthly income conversion**
  - Weekly: round(weekly × 52 / 12)
  - Fortnightly: round(fortnightly × 26 / 12)
  - Monthly: amount
  - Annual: round(annual / 12)
- **Monthly expenses**: round(weeklyTotal × 52 / 12)
- **Emergency fund target**: 6 × monthly expenses; progress capped at 100%
- **Emergency fund monthly allocation**: max(0, (target - starting balance) / 12) if not fully funded
- **Big goal months**: (goalDate − today) / 30.44 days per month (approx.)
- **Big goal monthly required**: round(target amount / months until date)
- **Feasibility thresholds**
  - Required > 80% of remaining income: error
  - > 50%: warning
  - Else: success
- **Chart visibility**: Only render when any of fixed/emergency/core exists.
- **Defaults**
  - City: Brisbane; sliders: Accommodation 350, Food 95, Transport 32.

---

## External Integrations
- **Charting**: Chart.js via CDN
- **External links**: Up Bank, UBank Save, Betashares Direct, Frollo (open in new tab)

---

## Constraints and Ranges
- **Sliders**
  - Accommodation: 0–800/week
  - Food: 0–300/week
  - Transport: 0–200/week
  - Presets: category-specific min/max (minimum $1/week)
- **Goal date** must be in the future to compute monthlyRequired.

---

## Acceptance Criteria (high-level)
- Selecting a city immediately adjusts the three main sliders and updates totals.
- Changing any expense value updates weekly/monthly/annual totals in real time.
- Income changes update monthly/annual income, emergency progress, allocations, and chart.
- Toggling Big goal shows inputs; valid future date + amount computes required monthly and feasibility.
- Allocation percentages reflect amounts / monthly income and sum to remaining income correctly.
- Year 1/3 outcome cards update with allocation changes.
- Definitions accordion: one open at a time; keyboard accessible.
- All data persists across reloads via localStorage.

---

## Future Enhancements
- Multi-profile save/load; export/import.
- Currency/locale formatting and units toggle (weekly/monthly).
- Input validation with inline messages; guard negative and extreme values.
- Scenario comparisons; printable summary.
- Optional taxes or net income calculators.

---

## Risks and Assumptions
- Assumes student expenses are weekly and can be linearly projected.
- Market growth assumption (Year 3) is illustrative, not advice.
- LocalStorage availability and quota limits apply.