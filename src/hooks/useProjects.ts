import { useState, useCallback, useMemo } from 'react';
import { TranscriptionAnalysis } from '@/types/analysis';

export type Project = {
	uuid: string;
	projectName: string;
	context: string;
	fileKey: string;
	createdAt: string;
	status?: 'COMPLETED' | 'PENDING' | 'FAILED';
};

export type CreateProjectData = {
	projectName: string;
	context: string;
	fileKey: string;
};

// Mock data - in a real app this would come from an API
const initialMockProjects: Project[] = [
	{
		uuid: 'd0c2f240-48c7-4caa-b65b-4cefea988f0a',
		projectName: 'Jennie Good',
		context: 'Webinar introducing DEUS',
		fileKey: 'Jennie-Good.mp4',
		createdAt: '2024-01-05',
		status: 'COMPLETED',
	},
	{
		uuid: 'd0c2f240-48c7-4caa-b65b-4cefea988f0c',
		projectName: 'Jennie Bad',
		context: 'Webinar introducing DEUS',
		fileKey: 'Jennie-Bad.mp4',
		createdAt: '2024-01-05',
		status: 'COMPLETED',
	},
	{
		uuid: 'demo-project-1',
		projectName: 'Q1 Sales Review',
		context: 'Quarterly sales performance analysis',
		fileKey: 'q1-sales-review.mp3',
		createdAt: '2024-01-15',
		status: 'COMPLETED',
	},
	{
		uuid: 'demo-project-2',
		projectName: 'Team Meeting Notes',
		context: 'Weekly team sync discussion points',
		fileKey: 'team-meeting-2024-01.wav',
		createdAt: '2024-01-10',
		status: 'COMPLETED',
	},
	{
		uuid: 'demo-project-3',
		projectName: 'Customer Interview',
		context: 'Product feedback session with key customer',
		fileKey: 'customer-interview.m4a',
		createdAt: '2024-01-08',
		status: 'PENDING',
	},
	{
		uuid: 'd0c2f240-48c7-4caa-b65b-4cefea988f0c',
		projectName: 'Jennie Good',
		context: 'Webinar discussing new product features',
		fileKey: 'product-launch-webinar.mp4',
		createdAt: '2024-01-05',
		status: 'COMPLETED',
	},
];

export const useProjects = () => {
	const [projects, setProjects] = useState<Project[]>(initialMockProjects);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Find project by ID
	const findProjectById = useCallback(
		(id: string): Project | undefined => {
			return projects.find((project) => project.uuid === id);
		},
		[projects]
	);

	// Get project analysis data (mock implementation)
	const getProjectAnalysis = useCallback(
		async (id: string): Promise<TranscriptionAnalysis | null> => {
			const project = findProjectById(id);
			if (!project) {
				return null;
			}

			// Mock API call delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Return mock analysis data based on project
			const mockAnalysis: TranscriptionAnalysis = {
				id: project.uuid,
				projectName: project.projectName,
				fileKey: project.fileKey,
				context: project.context,
				transcript: {
					text: `Good morning everyone, thank you for joining us today. I'm excited to share our ${project.projectName} and strategies that have led to our success.

Let me start with some impressive numbers. This quarter, we've seen a 35% increase in customer acquisition compared to Q1, with our enterprise segment showing particularly strong growth at 42%. These aren't just numbers on a spreadsheet – they represent real businesses that have chosen to trust us with their most critical operations.

What's driving this success? I believe it comes down to three key factors that I want to share with you today. First, our customer-centric approach. We don't just sell products; we solve problems. When we engage with potential clients, we take the time to understand their unique challenges and pain points.

For example, last month we worked with TechCorp Industries, a mid-size manufacturing company that was struggling with inventory management. Instead of pushing our standard solution, we listened. We learned that their main challenge wasn't just tracking inventory – it was predicting demand fluctuations during seasonal peaks.

Our team collaborated with their operations manager to develop a customized approach that integrated our core platform with their existing ERP system. The result? A 28% reduction in excess inventory and a 15% improvement in order fulfillment time. But more importantly, we earned a partner, not just a customer.

This brings me to our second key factor: the power of partnership. We don't see ourselves as vendors; we see ourselves as extensions of our clients' teams. This mindset shift has transformed how we approach every interaction, from initial discovery calls to post-implementation support.

Speaking of support, our customer success team has maintained a 98% satisfaction rating this quarter, with an average response time of under 2 hours for critical issues. This level of service isn't just about having good people – though we certainly do – it's about having systems and processes that prioritize customer success above everything else.

The third factor is innovation. Technology moves fast, and so do customer expectations. We've invested heavily in R&D this quarter, launching three major feature updates based directly on customer feedback. Our new analytics dashboard, for instance, was requested by 78% of our enterprise clients, and it's already being used by over 10,000 users daily.

But let me be honest with you – we're not perfect. We've had challenges too. Our initial rollout of the mobile app had some performance issues that frustrated several key accounts. However, how we responded to these challenges is what I'm most proud of. Within 48 hours, our engineering team had identified and fixed the core issues. We personally called every affected client to apologize and provide a timeline for resolution.

That experience taught us something valuable: transparency builds trust. Our clients don't expect us to be perfect, but they do expect us to be honest, responsive, and committed to making things right when issues arise.

Looking ahead to Q3, I'm excited about the opportunities in front of us. We have a pipeline of qualified prospects that's 60% larger than this time last quarter. We're expanding into two new vertical markets, and we're on track to launch our most requested feature – real-time collaboration tools – by the end of next month.

But success in Q3 won't just happen automatically. It will require the same commitment to excellence, the same customer-first mindset, and the same willingness to innovate that got us here. I'm confident that with this team and this approach, Q3 will be even better than Q2.

Are there any questions about our performance this quarter or our plans moving forward?`,
					durationMilliseconds: 180000, // 3 minutes
					locale: 'en-US',
					confidence: 0.873,
				},
				keyPoints: [
					'Strong opening with compelling statistics that captured audience attention',
					'Clear value proposition presentation with concrete examples',
					'Interactive customer engagement techniques including Q&A sessions',
					'Effective use of storytelling to illustrate product benefits',
					'Room for improvement in closing techniques and call-to-action clarity',
					'Good pace and energy throughout the presentation',
					'Professional handling of objections and questions',
				],
				status: project.status || 'COMPLETED',
				createdAt: new Date(project.createdAt).toISOString(),
				updatedAt: new Date().toISOString(),
				analysis: {
					overall_assessment: {
						score: 0.82,
						key_insights_summary:
							'The presentation demonstrates strong storytelling abilities and effective use of data to support key points. The speaker shows good energy and engagement with the audience throughout.',
						areas_for_improving: [
							'Stronger call-to-action in closing',
							'More interactive elements throughout',
							'Better transitions between sections',
							'Address potential objections proactively',
						],
					},
					presentation_breakdown: {
						storytelling_coherence: {
							score: 0.85,
							assessment:
								'Excellent narrative flow with clear beginning, middle, and end. Good use of specific examples like TechCorp Industries case study.',
							suggestions: [
								'Add more transitional phrases between major sections',
								'Consider using a recurring theme or metaphor',
								'Strengthen the connection between opening statistics and conclusion',
							],
						},
						listener_motivation: {
							score: 0.78,
							assessment:
								'Strong motivational content with concrete results and forward-looking vision. Could benefit from more audience interaction.',
							suggestions: [
								'Include more rhetorical questions to engage audience',
								'Add pauses for audience reflection',
								'Consider interactive polls or demonstrations',
							],
						},
						tone_of_voice_assessment: {
							formal_vs_casual: 0.3, // More formal
							serious_vs_funny: 0.2, // More serious
							respectful_vs_irreverent: 0.1, // Very respectful
							matter_of_fact_vs_enthusiastic: 0.7, // Quite enthusiastic
						},
						overused_elements: {
							keywords: [
								{ word: 'customer', count: 12 },
								{ word: 'success', count: 8 },
								{ word: 'growth', count: 6 },
								{ word: 'challenges', count: 5 },
							],
							expressions: [
								{ expression: 'let me', count: 4 },
								{ expression: 'what I want to share', count: 2 },
								{ expression: 'moving forward', count: 2 },
							],
							suggestions: [
								'Vary vocabulary when referring to customers (clients, partners, businesses)',
								'Use synonyms for "success" (achievement, results, outcomes)',
								'Replace repetitive phrase starters with more diverse openings',
							],
						},
						closing_statement_engagement: {
							score: 0.65,
							assessment:
								'The closing asks for questions but lacks a strong call-to-action or memorable final statement.',
							suggestions: [
								'End with a specific call-to-action',
								'Summarize key takeaways in a memorable way',
								'Leave audience with a compelling thought or challenge',
							],
						},
					},
					emotional_analysis: {
						identified_emotions: [
							{
								emotion: 'Confidence',
								quotes:
									"I'm excited to share our Q2 sales performance and strategies that have led to our success",
							},
							{
								emotion: 'Pride',
								quotes:
									"However, how we responded to these challenges is what I'm most proud of",
							},
							{
								emotion: 'Optimism',
								quotes:
									"Looking ahead to Q3, I'm excited about the opportunities in front of us",
							},
							{
								emotion: 'Honesty',
								quotes: "But let me be honest with you – we're not perfect",
							},
						],
						overall_emotional_arc:
							'The presentation follows a positive emotional journey, starting with confidence and excitement, acknowledging challenges with honesty, and ending on an optimistic note about the future.',
					},
				},
			};

			return mockAnalysis;
		},
		[findProjectById]
	);

	// Add new project
	const addProject = useCallback(
		async (projectData: CreateProjectData): Promise<Project> => {
			setIsLoading(true);
			setError(null);

			try {
				// Mock API call delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Create new project with generated UUID
				const newProject: Project = {
					uuid:
						'project-' +
						Date.now() +
						'-' +
						Math.random().toString(36).substr(2, 9),
					...projectData,
					createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
					status: 'PENDING',
				};

				setProjects((prev) => [newProject, ...prev]);
				return newProject;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to create project';
				setError(errorMessage);
				throw new Error(errorMessage);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Update project
	const updateProject = useCallback(
		async (id: string, updates: Partial<Project>): Promise<void> => {
			setIsLoading(true);
			setError(null);

			try {
				// Mock API call delay
				await new Promise((resolve) => setTimeout(resolve, 300));

				setProjects((prev) =>
					prev.map((project) =>
						project.uuid === id ? { ...project, ...updates } : project
					)
				);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Failed to update project';
				setError(errorMessage);
				throw new Error(errorMessage);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Delete project
	const deleteProject = useCallback(async (id: string): Promise<void> => {
		setIsLoading(true);
		setError(null);

		try {
			// Mock API call delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			setProjects((prev) => prev.filter((project) => project.uuid !== id));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to delete project';
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Search projects
	const searchProjects = useCallback(
		(query: string): Project[] => {
			if (!query.trim()) {
				return projects;
			}

			const lowercaseQuery = query.toLowerCase();
			return projects.filter(
				(project) =>
					project.projectName.toLowerCase().includes(lowercaseQuery) ||
					project.context.toLowerCase().includes(lowercaseQuery) ||
					project.fileKey.toLowerCase().includes(lowercaseQuery)
			);
		},
		[projects]
	);

	// Memoized computed values
	const projectCount = useMemo(() => projects.length, [projects]);
	const completedProjects = useMemo(
		() => projects.filter((p) => p.status === 'COMPLETED'),
		[projects]
	);
	const pendingProjects = useMemo(
		() => projects.filter((p) => p.status === 'PENDING'),
		[projects]
	);

	return {
		// Data
		projects,
		projectCount,
		completedProjects,
		pendingProjects,
		isLoading,
		error,

		// Methods
		findProjectById,
		getProjectAnalysis,
		addProject,
		updateProject,
		deleteProject,
		searchProjects,

		// Utilities
		clearError: () => setError(null),
	};
};
