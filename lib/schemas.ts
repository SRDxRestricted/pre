import { z } from "zod";

// ── Severity levels ──────────────────────────────────────────────────
export const SeveritySchema = z.enum(["critical", "high", "medium", "low"]);
export type Severity = z.infer<typeof SeveritySchema>;

// ── Charge (raised by the Prosecutor) ────────────────────────────────
export const ChargeSchema = z.object({
  id: z.string().describe("Unique identifier for this charge, e.g. 'CHG-1'"),
  title: z.string().describe("Short, descriptive title of the issue"),
  line: z.number().int().positive().describe("1-based line number in the submitted code"),
  severity: SeveritySchema,
  evidence: z.string().describe("Concrete explanation of why this line is problematic"),
});
export type Charge = z.infer<typeof ChargeSchema>;

// ── Prosecution output ───────────────────────────────────────────────
export const ProsecutionOutputSchema = z.object({
  charges: z.array(ChargeSchema).min(1, "Prosecutor must raise at least one charge"),
});
export type ProsecutionOutput = z.infer<typeof ProsecutionOutputSchema>;

// ── Defense response (one per charge) ────────────────────────────────
export const DefenseResponseItemSchema = z.object({
  chargeId: z.string().describe("Must match a Charge.id from the prosecution"),
  argument: z.string().describe("The defense's argument for/against this charge"),
  concede: z.boolean().describe("True if the defense concedes this charge is valid"),
});
export type DefenseResponseItem = z.infer<typeof DefenseResponseItemSchema>;

export const DefenseResponseSchema = z.object({
  responses: z
    .array(DefenseResponseItemSchema)
    .min(1, "Defense must respond to at least one charge"),
});
export type DefenseResponse = z.infer<typeof DefenseResponseSchema>;

// ── Ruling (one per charge, delivered by the Judge) ──────────────────
export const RulingSchema = z.enum(["guilty", "not_guilty", "mitigated"]);
export type Ruling = z.infer<typeof RulingSchema>;

export const VerdictRulingSchema = z.object({
  chargeId: z.string().describe("Must match a Charge.id from the prosecution"),
  ruling: RulingSchema,
  reasoning: z.string().describe("The judge's reasoning for this ruling"),
});
export type VerdictRuling = z.infer<typeof VerdictRulingSchema>;

// ── Full verdict ─────────────────────────────────────────────────────
export const VerdictSchema = z.object({
  rulings: z
    .array(VerdictRulingSchema)
    .min(1, "Judge must rule on at least one charge"),
  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Code health score: 0 = catastrophic, 100 = flawless"),
  fixes: z
    .array(z.string())
    .describe("Prioritized list of recommended fixes, most important first"),
});
export type Verdict = z.infer<typeof VerdictSchema>;
