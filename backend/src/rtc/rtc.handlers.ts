import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./rtc.events";
import { AIContextService } from "../modules/ai-context/aiContext.service";
import { InterviewerService } from "../modules/interviwer/interviewer.service";
import { InterviewAnswerService } from "../modules/interviwer/interviewAnswer.service";

export const registerSocketHandlers = (io: Server, socket: Socket) => {

  const parsePayload = (payload: any) => {
    try {
      // If payload is a string, parse it
      if (typeof payload === "string") {
        payload = JSON.parse(payload);
      }

      // If wrapped inside { data: {...} }
      if (payload?.data) {
        return payload.data;
      }

      return payload;
    } catch (err) {
      console.error(" Failed to parse payload:", payload);
      return null;
    }
  };

  // ============================
  // JOIN MEETING
  // ============================
  socket.on(SOCKET_EVENTS.JOIN_MEETING, async (payload) => {
    const data = parsePayload(payload);
    if (!data) return;

    const { meetingId, role } = data;

    if (!meetingId || !role) {
      console.error(" Invalid join payload:", data);
      return;
    }

    socket.join(meetingId);

    io.to(meetingId).emit(SOCKET_EVENTS.PARTICIPANT_JOINED, {
      role,
      message: `${role} joined the meeting`,
    });

    if (role === "CANDIDATE") {
      await AIContextService.createInitialContext(meetingId);

      io.to(meetingId).emit(SOCKET_EVENTS.AI_JOINED, {
        message: "AI interviewer joined",
      });

      const introQuestion = "Hello! Please upload your resume to begin.";

      await AIContextService.setCurrentQuestion(meetingId, introQuestion);

      io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
        question: introQuestion,
      });

    }
  });

  // ============================
  // USER ANSWER
  // ============================
  socket.on(SOCKET_EVENTS.USER_ANSWER, async (payload) => {
    const data = parsePayload(payload);
    if (!data) return;

    const { meetingId, answer } = data;

    if (!meetingId || !answer) {
      console.error(" Invalid answer payload:", data);
      return;
    }

    await InterviewAnswerService.submitAnswer({
      meetingId,
      answer,
    });

    io.to(meetingId).emit(SOCKET_EVENTS.AI_FEEDBACK, {
      message: "Thanks for your answer!",
    });
    const next = await InterviewerService.getNextQuestion(meetingId);

    if (next) {
      await AIContextService.setCurrentQuestion(meetingId, next.question);

      io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
        question: next.question,
      });
    }

  });

  // ============================
  // HUMAN QUESTION
  // ============================
  socket.on(SOCKET_EVENTS.HUMAN_QUESTION, (payload) => {
    const data = parsePayload(payload);
    if (!data) return;

    const { meetingId, question } = data;

    if (!meetingId || !question) {
      console.error(" Invalid human question payload:", data);
      return;
    }

    io.to(meetingId).emit(SOCKET_EVENTS.AI_QUESTION, {
      question,
    });
  });
};
