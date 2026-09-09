# kidsWealthStrategy

# Student Wealth Builder App

## Purpose and Overview

The Student Wealth Builder is a web app designed to help Australian students and early-career youth take charge of their finances. It provides a **realistic living expense estimator** and a **simple rules-based wealth allocation plan**. Students can input their expected expenses and income, then instantly see a breakdown of how to allocate money each month – from essentials and emergency savings to investments and fun spending.

Key objectives of the app include:

- **Budget Planning:** Estimate weekly, monthly, and annual living costs based on city-specific presets and personal choices.
- **Wealth Strategy:** Create a monthly money plan that covers fixed expenses, builds an emergency fund, contributes to investments (like ETFs), and saves for big goals – all while leaving room for flexible spending.
- **Financial Literacy:** Introduce core financial concepts (budgeting, emergency funds, investing, etc.) in an **engaging, student-friendly way** so young users learn as they plan.

The app is **client-side only** (no backend server needed). All data is stored locally on the user’s device, ensuring privacy and offline access. With a responsive design, it works on mobile or desktop, making it easy for students to use anywhere.

## 🚀 Start Investing Guide

**[`guide.html`](guide.html)** — A directive, mobile-friendly guide for Australian young adults to start investing with Betashares Direct.

### What it is:
A completely rewritten guide focused on **clear next steps** and **risk profiles with exact ETF picks**:
- **5-step accordion:** Emergency fund → Open account → Fund → Pick risk profile → Automate
- **Risk profile cards:** Conservative / Balanced / Growth with specific tickers and percentages
- **"Buy this" checklists:** Dollar-for-dollar examples ($100/month split by %)
- **Collapsed glossary and resources:** On demand, not front-and-center
- Directive tone: "Here's what to buy" not endless theory

### Risk profiles included:
- **Conservative:** AAA 30% · QPON 20% · CRED 15% · WBND 15% · A200 10% · BGBL 10%
- **Balanced:** A200 30% · BGBL 45% · CRED 15% · AAA 10% (or ultra-simple: A200 40% · BGBL 60%)
- **Growth:** NDQ 35% · BGBL 25% · A200 15% · ASIA 15% · BEMG 10%

All portfolios are Dad's coaching examples for education — not personal advice.

### How to share:
1. **GitHub Pages:** Share `https://leezo77.github.io/kidsWealthStrategy/guide.html`
2. **Local file:** Open `guide.html` in any browser (works offline)
3. **Download:** Send the HTML file directly

The guide cross-links to the Student Wealth Builder calculator (`index.html`) for expense estimation.

## Onboarding Experience

On first use, the app provides a **playful onboarding journey** to gently introduce financial concepts:

- **Step-by-Step Guidance:** The user is greeted with a friendly introduction and guided to start with the basics. For example, a prompt like “Let’s plan your budget! First, where will you live for uni?” leads into selecting a city and setting expenses.
- **Progressive Disclosure:** Features are revealed gradually. Initially, the student focuses on entering expenses using fun, interactive sliders (with emojis or icons for categories like 🍔 for food, 🏠 for rent). Only after getting a basic expense total does the app introduce the wealth allocation plan.
- **Interactive Visuals:** As the user inputs information, visuals update in real-time. For instance, when they adjust the rent slider, an apartment icon might fill up to illustrate spending. Later, when moving to the wealth strategy, a colorful pie chart animates to show how their income could be split into savings and investments.
- **Real-life Examples:** The onboarding uses relatable scenarios and language appropriate for kids and teenagers. For example, when explaining an *emergency fund*, the app might say: “Imagine your laptop breaks suddenly – an emergency fund helps you pay for a new one without stress.” Each concept (like ETFs or budgets) is explained with a simple analogy or story.
- **Friendly Tone and Gamification:** The app might feature a friendly mascot (for example, a small kangaroo or a piggy bank character) that gives tips and celebrates achievements. As the student completes each step (like entering all their expenses or setting up a savings goal), the mascot might cheer them on, making the experience feel like a game.

Throughout onboarding, the focus is on **making finance fun and understandable**. By the end of the onboarding flow, the student has entered their key data and learned the basics of budgeting, saving, and investing in a hands-on way. They’re then ready to use the app’s full functionality, with tooltips and a glossary available if they need a refresher on any concept.
