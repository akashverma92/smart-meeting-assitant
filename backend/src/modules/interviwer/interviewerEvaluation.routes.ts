import { Router } from "express";
import { InterviewAnswerModel } from "./interviewAnswer.model";
import { requireAuth } from "../../middlewares/auth.middleware";
const router = Router();
router.post("/:answerId/evaluate", requireAuth, async (req, res) => {
  const { score, feedback } = req.body;

  const updated = await InterviewAnswerModel.findByIdAndUpdate(
    req.params.answerId,
    {
      humanScore: score,
      humanFeedback: feedback,
    },
    { new: true }
  );

  res.json(updated);
});
export default router;
