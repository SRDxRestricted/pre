/**
 * Quick smoke-test for lib/schemas.ts
 * Run with: npx tsx lib/schemas.test.ts
 */
import {
  ProsecutionOutputSchema,
  DefenseResponseSchema,
  VerdictSchema,
} from "./schemas";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${e}`);
    failed++;
  }
}

console.log("\n🔍  Schema tests\n");

// ── ProsecutionOutput ────────────────────────────────────────────────
test("ProsecutionOutput parses a valid object", () => {
  const result = ProsecutionOutputSchema.parse({
    charges: [
      {
        id: "CHG-1",
        title: "Unchecked null dereference",
        line: 12,
        severity: "critical",
        evidence: "user.name is accessed without a null check on line 12",
      },
      {
        id: "CHG-2",
        title: "Magic number",
        line: 7,
        severity: "low",
        evidence: "The constant 86400 should be named SECONDS_PER_DAY",
      },
    ],
  });
  if (result.charges.length !== 2) throw new Error("Expected 2 charges");
});

test("ProsecutionOutput rejects empty charges array", () => {
  const result = ProsecutionOutputSchema.safeParse({ charges: [] });
  if (result.success) throw new Error("Should have failed");
});

test("ProsecutionOutput rejects invalid severity", () => {
  const result = ProsecutionOutputSchema.safeParse({
    charges: [
      {
        id: "CHG-1",
        title: "Test",
        line: 1,
        severity: "extreme",
        evidence: "test",
      },
    ],
  });
  if (result.success) throw new Error("Should have failed");
});

// ── DefenseResponse ──────────────────────────────────────────────────
test("DefenseResponse parses a valid object", () => {
  const result = DefenseResponseSchema.parse({
    responses: [
      {
        chargeId: "CHG-1",
        argument:
          "The null check is handled by the caller; this is an internal function.",
        concede: false,
      },
      {
        chargeId: "CHG-2",
        argument: "Fair point — this should be a named constant.",
        concede: true,
      },
    ],
  });
  if (result.responses.length !== 2) throw new Error("Expected 2 responses");
});

test("DefenseResponse rejects missing concede field", () => {
  const result = DefenseResponseSchema.safeParse({
    responses: [{ chargeId: "CHG-1", argument: "test" }],
  });
  if (result.success) throw new Error("Should have failed");
});

// ── Verdict ──────────────────────────────────────────────────────────
test("Verdict parses a valid object", () => {
  const result = VerdictSchema.parse({
    rulings: [
      {
        chargeId: "CHG-1",
        ruling: "guilty",
        reasoning:
          "The null dereference is real and the caller does not guard against it.",
      },
      {
        chargeId: "CHG-2",
        ruling: "mitigated",
        reasoning:
          "While the magic number is present, the function is small and readable.",
      },
    ],
    score: 45,
    fixes: [
      "Add a null check for user.name on line 12",
      "Extract 86400 into a named constant SECONDS_PER_DAY",
    ],
  });
  if (result.score !== 45) throw new Error("Expected score 45");
  if (result.rulings.length !== 2) throw new Error("Expected 2 rulings");
});

test("Verdict rejects score out of range (negative)", () => {
  const result = VerdictSchema.safeParse({
    rulings: [
      { chargeId: "CHG-1", ruling: "guilty", reasoning: "test" },
    ],
    score: -5,
    fixes: [],
  });
  if (result.success) throw new Error("Should have failed");
});

test("Verdict rejects score out of range (>100)", () => {
  const result = VerdictSchema.safeParse({
    rulings: [
      { chargeId: "CHG-1", ruling: "not_guilty", reasoning: "test" },
    ],
    score: 150,
    fixes: [],
  });
  if (result.success) throw new Error("Should have failed");
});

test("Verdict rejects invalid ruling value", () => {
  const result = VerdictSchema.safeParse({
    rulings: [
      { chargeId: "CHG-1", ruling: "acquitted", reasoning: "test" },
    ],
    score: 80,
    fixes: [],
  });
  if (result.success) throw new Error("Should have failed");
});

// ── Summary ──────────────────────────────────────────────────────────
console.log(`\n  ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
