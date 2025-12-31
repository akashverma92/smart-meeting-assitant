import { api } from "../lib/axiosClient";

export const interviewService = {
    // Get next interview question
    getNextQuestion: (meetingId: string) =>
        api.get(`/interviewer/v1/${meetingId}/next-question`),

    // Submit answer to interview question
    submitAnswer: (meetingId: string, answer: string) =>
        api.post(`/interviewer/v1/${meetingId}/answer`, { answer }),
};
