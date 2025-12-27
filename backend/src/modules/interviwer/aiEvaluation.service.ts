export class AIEvaluationService {
  static evaluate(answer: string) {
    // Placeholder logic for now
    const score = Math.min(10, Math.max(5, answer.length / 20));

    return {
      score,
      feedback:
        score > 7
          ? "Good explanation with clarity."
          : "Needs more depth and clarity.",
    };
  }
}
