export type TranscriptionAnalysis = {
  id: string;
  projectName: string;
  fileKey: string;
  context: string;
  transcript: {
    text: string;
    durationMilliseconds: number;
    locale: string;
    confidence: number;
  };
  keyPoints: string[];
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  analysis: {
    overall_assessment: {
      score: number; // 0 to 1
      key_insights_summary: string;
      areas_for_improving: string[];
    };
    presentation_breakdown: {
      storytelling_coherence: {
        score: number; // 0 to 1
        assessment: string;
        suggestions: string[];
      };
      listener_motivation: {
        score: number; // 0 to 1
        assessment: string;
        suggestions: string[];
      };
      tone_of_voice_assessment: {
        formal_vs_casual: number; // 0 = formal, 1 = casual
        serious_vs_funny: number; // 0 = serious, 1 = funny
        respectful_vs_irreverent: number; // 0 = respectful, 1 = irreverent
        matter_of_fact_vs_enthusiastic: number; // 0 = factual, 1 = enthusiastic
      };
      overused_elements: {
        keywords: {
          word: string;
          count: number;
        }[];
        expressions: {
          expression: string;
          count: number;
        }[];
        suggestions: string[];
      };
      closing_statement_engagement: {
        score: number; // 0 to 1
        assessment: string;
        suggestions: string[];
      };
    };
    emotional_analysis: {
      identified_emotions: {
        emotion: string;
        quotes: string;
      }[];
      overall_emotional_arc: string;
    };
  };
};