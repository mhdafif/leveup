---
title: Refactoring
order: 7
estMinutes: 30
difficulty: medium
checklist:
  - Define refactoring and distinguish it from rewriting or adding features
  - Apply Extract Function, Rename Variable, and Introduce Parameter Object
  - Replace a complex conditional with polymorphism
  - Explain why tests are a prerequisite for safe refactoring
  - Identify and categorise technical debt in a codebase
---

Refactoring is the process of changing a software system's internal structure without altering its observable behaviour. Martin Fowler's *Refactoring: Improving the Design of Existing Code* (1st ed. 1999, 2nd ed. 2018) catalogued over 60 named refactorings, each a small, safe, behaviour-preserving transformation. The discipline exists because code degrades: quick fixes, changing requirements, and time pressure produce structures that were reasonable when written but become obstacles to future work.

## When to Refactor

Refactoring is not a separate phase — it is continuous. The most effective model is the **rule of three**:
1. First time doing something: just do it.
2. Second time doing something similar: notice the duplication.
3. Third time: refactor.

Refactor just before adding a feature when the current structure makes the feature hard. Refactor just after fixing a bug when you notice the code that hid the bug. Refactor during code review when a reviewer spots a clearer structure.

> [!WARNING]
> Do not refactor and add functionality in the same commit. Two jobs in one change makes the diff impossible to review and the git bisect harder to use. Keep the behaviour-preserving refactoring in one commit, then add the feature in the next.

## Core Refactorings

### Extract Function

When a block of code can be grouped by intention, extract it into a named function. The name *is* the comment.

```ts
// Before
function printInvoice(invoice: Invoice) {
  // calculate outstanding
  let outstanding = 0;
  for (const order of invoice.orders) {
    outstanding += order.amount;
  }
  console.log(`Customer: ${invoice.customer}`);
  console.log(`Amount owed: ${outstanding}`);
}

// After
function calculateOutstanding(invoice: Invoice): number {
  return invoice.orders.reduce((sum, order) => sum + order.amount, 0);
}

function printInvoice(invoice: Invoice) {
  const outstanding = calculateOutstanding(invoice);
  console.log(`Customer: ${invoice.customer}`);
  console.log(`Amount owed: ${outstanding}`);
}
```

### Rename Variable

A variable's name should communicate its purpose fully. Renaming is the most frequently applied refactoring and pays the most per keystroke.

```ts
// Before — what is d? what is arr?
const d = computeDelta(arr);

// After — unambiguous
const priceDelta = computeDelta(historicalPrices);
```

### Introduce Parameter Object

When the same cluster of parameters appears together in multiple functions, group them into a named type.

```ts
// Before — three parameters always travel together
function createReport(startDate: Date, endDate: Date, userId: string) { ... }
function exportReport(startDate: Date, endDate: Date, userId: string) { ... }

// After
interface ReportCriteria {
  startDate: Date;
  endDate: Date;
  userId: string;
}

function createReport(criteria: ReportCriteria) { ... }
function exportReport(criteria: ReportCriteria) { ... }
```

### Replace Conditional with Polymorphism

A `switch` or `if/else if` chain that checks a type field and branches on it is a sign that the type field should be a class hierarchy.

```ts
// Before
function getShippingCost(order: Order): number {
  switch (order.shippingType) {
    case "standard": return order.weight * 2;
    case "express":  return order.weight * 5;
    case "overnight": return order.weight * 10;
  }
}

// After — each type encapsulates its own calculation
abstract class ShippingMethod {
  abstract cost(order: Order): number;
}

class StandardShipping extends ShippingMethod {
  cost(order: Order) { return order.weight * 2; }
}

class ExpressShipping extends ShippingMethod {
  cost(order: Order) { return order.weight * 5; }
}
```

## Refactoring Safely with Tests

Refactoring without tests is reckless. The only way to verify behaviour is preserved is to run an automated test suite before and after every change. The workflow is:

1. Run the test suite — it must be green before you start.
2. Make one small refactoring.
3. Run the tests again. If they pass, commit. If they fail, undo immediately.
4. Repeat.

> [!IMPORTANT]
> If the code you want to refactor has no tests, write characterisation tests first — tests that capture the current (possibly wrong) behaviour so you have a safety net. Then refactor.

## Technical Debt

Ward Cunningham coined the term "technical debt" in 1992. Like financial debt, it accrues *interest*: code that was written hastily needs to be understood and worked around on every future change. Debt is not always bad — sometimes a quick solution is the right choice when speed matters. The problem is debt that is never repaid.

| Debt type | Cause | Treatment |
|---|---|---|
| Deliberate, reckless | "We don't have time for design" | Mandatory refactoring sprint |
| Deliberate, prudent | "Ship now, clean up later" | Plan repayment in the next sprint |
| Inadvertent | "Now we know what we should have done" | Refactor as you go |
| Accidental | Code rotted as context changed | Boy scout rule |

> [!TIP]
> Make technical debt visible. A backlog item named "Refactor OrderService — currently does 6 things" is better than invisible entropy. Teams that track debt are more likely to repay it.

## Further Learning

Search these terms to go deeper:
- **"Refactoring Martin Fowler second edition"** — the canonical catalogue; the online version at refactoring.com lists all refactorings
- **"technical debt Ward Cunningham origin"** — the original 1992 OOPSLA talk introducing the metaphor
- **"characterisation tests Michael Feathers Working Effectively with Legacy Code"** — the definitive book on adding tests to untested code
- **"refactoring to patterns Joshua Kerievsky"** — how refactoring and design patterns connect
- **"continuous refactoring ThoughtWorks"** — the industry perspective on embedding refactoring in everyday work
