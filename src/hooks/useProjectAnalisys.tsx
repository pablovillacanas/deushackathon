import { useState, useEffect, useCallback } from 'react';
import { TranscriptionAnalysis } from '@/types/analysis';

const mockGood = {
	"id": "d0c2f240-48c7-4caa-b65b-4cefea988f0c",
	"projectName": "Jennie Good",
	"fileKey": "1748614755132_First Take - Jennie Bad.mp3",
	"context": "test context",
	"transcript": {
		"text": "Hello really great to connect. Thank you so much for your time. Let me tell you a little bit about our company about Deus. Who we are and what we actually what we do, what kind of services we provide. We are we are called Deus and we are humanity centered a I we are a team of data scionists and engineeringers, designers and people who strategy strategy. Strategists based in Amsterdam, Porto and a a Coru. OK, Yep, Yep, exactly. So we are our mission. Yes, our mission, our mission is really simple but also ambitious. So how can I explain that? Yes, our mission is we want to unlock the potential of a I for for the for the best of the humans and and the whole humanity. We want to by building building what we call machines of assistance. And and we provide these IE solutions that truly support people, people, instead of replacing them. And what sets us apart is our inter interdisciplinary, interdisciplinary approach. And we bring them together. What we do bring together is how do I say **** I forgot the word of course data and then also design and engine engineering and that strategic thinking. That's also the strategic thinking. That's what we do to deliver a I powered products and services. They are really smart. They're really smart and very, very, very, very useful and. Really, really ethical, really ethical and scalable of course as well because that's also very, very important. So yes, there we focus then on the three, three areas, three main areas. So the first one is IE and innovation strategy, innovation strategy, yes. And we help to organizations explore and fast track. I E opportunities from ideation to actual working proof of concepts. That could be a leadership workshop or we can dive very deep like into like potential use case. I'm not sure how to say that we can even build like a prototype. We can even build a prototype in 12 weeks and it's a really, really great way to explore what AI can actually do for a business.",
		"durationMilliseconds": 220525,
		"locale": "en-US",
		"confidence": 0.9181230499999999
	},
	"keyPoints": [
		"Simulated AI analysis based on context 'test context': The transcript mentions key performance indicators and action items for the next sprint."
	],
	"analysis": {
		"overall_assessment": {
			"score": 0.65,
			"key_insights_summary": "The presentation communicates a passionate mission and introduces the company's services, but suffers from disfluencies, repetition, and lack of structure.",
			"areas_for_improving": [
				"Improve fluency and reduce filler words and hesitations.",
				"Structure the message with clearer sections (e.g., intro, mission, services).",
				"Practice a more confident and concise delivery to reinforce credibility."
			]
		},
		"presentation_breakdown": {
			"storytelling_coherence": {
				"score": 0.6,
				"assessment": "The message is scattered, with repetition and interruptions affecting clarity. The narrative lacks a smooth, logical progression.",
				"suggestions": [
					"Create a structured outline before speaking.",
					"Use transitions to guide listeners through the story.",
					"Rehearse with time limits to improve delivery flow."
				]
			},
			"listener_motivation": {
				"score": 0.7,
				"assessment": "The enthusiasm and ethical mission could inspire listeners, but the lack of polish may reduce the perceived authority.",
				"suggestions": [
					"Deliver key ideas with stronger emphasis and clarity.",
					"Reduce distractions caused by restatements or forgotten words.",
					"Add a strong, direct call-to-action at the end."
				]
			},
			"tone_of_voice_assessment": {
				"formal_vs_casual": 0.75,
				"serious_vs_funny": 0.2,
				"respectful_vs_irreverent": 0.1,
				"matter_of_fact_vs_enthusiastic": 0.85
			},
			"overused_elements": {
				"keywords": [
					{
						"word": "really",
						"count": 8
					},
					{
						"word": "AI",
						"count": 5
					},
					{
						"word": "mission",
						"count": 4
					},
					{
						"word": "strategy",
						"count": 3
					}
				],
				"expressions": [
					{
						"expression": "we are",
						"count": 5
					},
					{
						"expression": "how do I say",
						"count": 2
					},
					{
						"expression": "let me tell you",
						"count": 1
					}
				],
				"suggestions": [
					"Limit the use of 'really' to retain impact.",
					"Vary the language around key ideas like 'AI' and 'strategy' to avoid sounding repetitive.",
					"Avoid self-referential expressions like 'how do I say' which interrupt the flow."
				]
			},
			"closing_statement_engagement": {
				"score": 0.5,
				"assessment": "The closing attempts to summarize a service offering but lacks a strong concluding message or call to action.",
				"suggestions": [
					"Summarize the key value proposition more clearly.",
					"End with a confident invitation to engage or learn more.",
					"Avoid trailing off with uncertain phrasing."
				]
			}
		},
		"emotional_analysis": {
			"identified_emotions": [
				{
					"emotion": "enthusiasm",
					"quotes": [
						"Hello really great to connect. Thank you so much for your time.",
						"We are humanity centered AI...",
						"They are really smart and very, very, very, very useful and... really, really ethical."
					]
				},
				{
					"emotion": "confusion/uncertainty",
					"quotes": [
						"How do I say **** I forgot the word...",
						"I'm not sure how to say that..."
					]
				},
				{
					"emotion": "pride",
					"quotes": [
						"We are a team of data scientists and engineers, designers and people who strategy strategy...",
						"We can even build a prototype in 12 weeks and it's a really, really great way to explore what AI can actually do..."
					]
				}
			],
			"overall_emotional_arc": "The presentation starts with positive energy and enthusiasm, dips into uncertainty during unscripted segments, and attempts to recover with pride in the company's capabilities."
		}
	},
	"status": "COMPLETED",
	"createdAt": "2025-05-30T14:23:16.629Z",
	"updatedAt": "2025-05-30T14:36:20.791Z"
}

const mockBad = {
	"id": "764962c9-387f-4e85-9b2f-49c61b193116",
	"projectName": "Jennie Bad",
	"fileKey": "1748614834652_First Take - Jennie Good.mp3",
	"context": "test context",
	"transcript": {
		"text": "Hey, hello, nice to connect. Let me tell you a little bit more about Deus, who we are and what we do. We are called Deus, Humanity Centered AI. We are a team of data scientists, engineers, designers and strategists based in Amsterdam, Porto and A Coruna. Our mission is simple but ambitious. We want to unlock the potential of AI for the benefit of humans and humanity by building what we call machines of assistance. These are the AI solutions that truly support people instead of replacing them. What sets us apart is our interdisciplinary approach. We bring together data, design, engineering, and strategic thinking to deliver AI-powered products and services that are not just smart, but also useful, ethical, and scalable. We focus on three main areas, AI and innovation strategy, Here we help organizations explore and fast track AI opportunities from ideation to actual working proof of concepts. That could be a leadership workshop, a dive, a deep dive into potential use cases, or even building a prototype in 12 weeks. It's a great way to explore what a I can really do for our business. The second one is data architecture and platforms. We design and build scalable data infrastructures. On platforms like Azure and a WS that ensure data is accessible, secure and actionable. For example, we helped Shell design a global data mesh with Signal. We built a lake house that helps reduce emissions in the aviation and shipping industries. Then the third is data and AI and AI powered applications. We built real world. Applications using techniques like NLP, computer vision and large language models. Think of tools that scan influencer videos for ad compliance or a I that enriches metadata for national libraries. On top of that, we're also involved in research around ethical and transparent A I. We sponsor academic research and partner with nonprofits and social innovators. Because we believe a I should be in service of people and not the other way around. And whether we're working with a big tech partner or mentoring students, everything we do is grounded in our core values, integrity, curiosity, creation and collaboration. If you're exploring now how I how I I could bring value to your business or you're struggling to scale data initiatives, this is exactly what we do. We'd love to see how we can help. Thank you for your time.",
		"durationMilliseconds": 167732,
		"locale": "en-US",
		"confidence": 0.9302947899999998
	},
	"keyPoints": [
		"Simulated AI analysis based on context 'test context': The transcript mentions key performance indicators and action items for the next sprint."
	],
	"analysis": {
		"overall_assessment": {
			"score": 0.82,
			"key_insights_summary": "The presentation effectively introduced the company and conveyed its mission with clarity and enthusiasm, though it could benefit from smoother structure and a more impactful close.",
			"areas_for_improving": [
				"Refine the structure to avoid redundancy and improve narrative flow.",
				"Make the closing statement more memorable with a clear call to action.",
				"Reduce filler phrases to improve speech fluency and authority."
			]
		},
		"presentation_breakdown": {
			"storytelling_coherence": {
				"score": 0.76,
				"assessment": "The storytelling successfully communicates Deus' mission, team composition, and areas of expertise, but has minor disruptions in pacing and coherence due to filler words and a couple of repeated phrases.",
				"suggestions": [
					"Structure the content more clearly into sections (e.g., intro, mission, offerings, closing).",
					"Reduce informal repetitions and stammering (e.g., 'how I how I I').",
					"Use transitions to guide listeners through sections."
				]
			},
			"listener_motivation": {
				"score": 0.79,
				"assessment": "The speaker conveys a strong sense of purpose and values, which is motivating, though the delivery could use a more energized or conclusive finale.",
				"suggestions": [
					"End with a compelling call to action or a visionary statement.",
					"Include an example or success story to reinforce impact.",
					"Use more direct language when inviting listeners to engage."
				]
			},
			"tone_of_voice_assessment": {
				"formal_vs_casual": 0.65,
				"serious_vs_funny": 0.15,
				"respectful_vs_irreverent": 0.1,
				"matter_of_fact_vs_enthusiastic": 0.75
			},
			"overused_elements": {
				"keywords": [
					{
						"word": "AI",
						"count": 9
					},
					{
						"word": "data",
						"count": 6
					},
					{
						"word": "build",
						"count": 4
					}
				],
				"expressions": [
					{
						"expression": "we are",
						"count": 5
					},
					{
						"expression": "for example",
						"count": 2
					},
					{
						"expression": "what we do",
						"count": 2
					}
				],
				"suggestions": [
					"Use synonyms or restructure sentences to avoid repetition.",
					"Be mindful of overusing self-referential phrases like 'we are' to maintain listener interest.",
					"Balance technical terms with illustrative examples or metaphors."
				]
			},
			"closing_statement_engagement": {
				"score": 0.6,
				"assessment": "The closing is polite and expresses willingness to help, but lacks a strong, memorable hook or direction for the listener.",
				"suggestions": [
					"Craft a more specific invitation (e.g., 'Let's schedule a discovery call').",
					"End with a confident statement about the impact Deus can have.",
					"Use a memorable phrase or tagline to leave a lasting impression."
				]
			}
		},
		"emotional_analysis": {
			"identified_emotions": [
				{
					"emotion": "enthusiasm",
					"quotes": [
						"Let me tell you a little bit more about Deus, who we are and what we do.",
						"Our mission is simple but ambitious.",
						"Think of tools that scan influencer videos for ad compliance..."
					]
				},
				{
					"emotion": "pride",
					"quotes": [
						"We are a team of data scientists, engineers, designers and strategists based in Amsterdam, Porto and A Coruna.",
						"We helped Shell design a global data mesh with Signal."
					]
				},
				{
					"emotion": "empathy",
					"quotes": [
						"We want to unlock the potential of AI for the benefit of humans and humanity...",
						"Because we believe AI should be in service of people and not the other way around."
					]
				}
			],
			"overall_emotional_arc": "The presentation starts with excitement and gradually deepens into values-driven pride and purpose. It maintains a warm, enthusiastic tone throughout, though it slightly flattens toward the end."
		}
	},
	"status": "COMPLETED",
	"createdAt": "2025-05-30T14:38:49.672Z",
	"updatedAt": "2025-05-30T14:42:26.245Z"
}

export const useProjectAnalysis = (projectId?: string) => {
  const [analysis, setAnalysis] = useState<TranscriptionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock logic: return different analysis based on project ID
      let mockAnalysis: TranscriptionAnalysis;

      // Use project ID to determine which mock to return
      // If project ID contains 'good' or has even length, return mockGood
      // Otherwise return mockBad
      if (id.toLowerCase().includes('good') || id.length % 2 === 0) {
        const baseMock = mockGood;
        mockAnalysis = {
          ...baseMock,
          id: id, // Update the ID to match the requested project
          updatedAt: new Date().toISOString(),
          status: 'COMPLETED' as const,
          analysis: {
            ...baseMock.analysis,
            emotional_analysis: {
              ...baseMock.analysis.emotional_analysis,
              identified_emotions: baseMock.analysis.emotional_analysis.identified_emotions.map(emotion => ({
                emotion: emotion.emotion,
                quotes: Array.isArray(emotion.quotes) ? emotion.quotes.join(' ') : emotion.quotes
              }))
            }
          }
        };
      } else {
        const baseMock = mockBad;
        mockAnalysis = {
          ...baseMock,
          id: id, // Update the ID to match the requested project
          updatedAt: new Date().toISOString(),
          status: 'COMPLETED' as const,
          analysis: {
            ...baseMock.analysis,
            emotional_analysis: {
              ...baseMock.analysis.emotional_analysis,
              identified_emotions: baseMock.analysis.emotional_analysis.identified_emotions.map(emotion => ({
                emotion: emotion.emotion,
                quotes: Array.isArray(emotion.quotes) ? emotion.quotes.join(' ') : emotion.quotes
              }))
            }
          }
        };
      }

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to fetch analysis');
      console.error('Error fetching analysis:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch analysis when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchAnalysis(projectId);
    } else {
      setAnalysis(null);
      setError(null);
      setIsLoading(false);
    }
  }, [projectId, fetchAnalysis]);

  // Manual refetch function
  const refetch = useCallback(() => {
    if (projectId) {
      fetchAnalysis(projectId);
    }
  }, [projectId, fetchAnalysis]);

  return {
    analysis,
    isLoading,
    error,
    refetch
  };
};

