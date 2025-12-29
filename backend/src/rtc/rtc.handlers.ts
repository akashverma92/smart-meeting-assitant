import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./rtc.events";
import { AIContextService } from "../modules/ai-context/aiContext.service";
import { InterviewerService } from "../modules/interviwer/interviewer.service";
import { InterviewAnswerService } from "../modules/interviwer/interviewAnswer.service";

export const registerSocketHandlers = (io: Server, socket: Socket) => {

  socket.on(SOCKET_EVENTS.JOIN_MEETING, async ({ meetingId, role }) => {
    socket.join(meetingId);

    io.to(meetingId).emit(SOCKET_EVENTS.PARTICIPANT_JOINED, {
      role,
      message: `${role} joined the meeting`,
    });

    // AI auto-joins
    if (role === "CANDIDATE") {
      await AIContextService.createInitialContext(meetingId);

      io.to(meetingId).emit(SOCKET_EVENTS.AI_JOINED, {
        message: "AI interviewer joined",
      });

      // Greeting
      io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
        question: "Hello! Please upload your resume to begin.",
      });
    }
  });

  socket.on(SOCKET_EVENTS.USER_ANSWER, async (payload) => {
    const { meetingId, answer } = payload;

    const saved = await InterviewAnswerService.submitAnswer({
      meetingId,
      answer,
    });

    io.to(meetingId).emit(SOCKET_EVENTS.AI_FEEDBACK, {
      message: "Thanks for your answer!",
    });

    // Ask next question
    const next = await InterviewerService.getNextQuestion(meetingId);

    if (next) {
      io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
        question: next.question,
      });
    } else {
      io.to(meetingId).emit(SOCKET_EVENTS.INTERVIEW_COMPLETED);
    }
  });

  socket.on(SOCKET_EVENTS.HUMAN_QUESTION, async ({ meetingId, question }) => {
    io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
      question,
    });
  });
};
