import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadFileFromAzure, openFileInNewTab } from '@/utils/azureStorage';
import { TranscriptionAnalysis } from '@/types/analysis';
import { useProjects } from '@/hooks/useProjects';
import { useProjectAnalysis } from '@/hooks/useProjectAnalisys';

const Analysis = () => {
	const { projectUuid } = useParams<{ projectUuid: string }>();
	const navigate = useNavigate();
	const { findProjectById } = useProjects();
	const { analysis, isLoading } = useProjectAnalysis(projectUuid);
	const [analysisData, setAnalysisData] =
		useState<TranscriptionAnalysis | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownloadFile = async () => {
		if (!analysisData?.fileKey) {
			console.error('No file key available for download');
			return;
		}

		setIsDownloading(true);
		try {
			const success = await downloadFileFromAzure(analysisData.fileKey);
			if (!success) {
				console.log('Direct download failed, opening in new tab as fallback');
				openFileInNewTab(analysisData.fileKey);
			}
		} catch (error) {
			console.error('Error downloading file:', error);
			// Fallback to opening in new tab
			openFileInNewTab(analysisData.fileKey);
		} finally {
			setIsDownloading(false);
		}
	};

	useEffect(() => {
		const fetchAnalysis = async () => {
			if (!projectUuid) {
				setError('Project UUID is required');
				return;
			}

			try {
				setError(null);

				// Check if project exists
				const project = findProjectById(projectUuid);
				if (!project) {
					setError('Project not found');
					return;
				}

				setAnalysisData(analysis);
			} catch (err) {
				setError('Failed to load analysis data');
				console.error('Error fetching analysis:', err);
			}
		};

		fetchAnalysis();
	}, [projectUuid, findProjectById, analysis]);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
				<div className='flex items-center space-x-2'>
					<svg
						className='animate-spin h-8 w-8 text-indigo-600'
						viewBox='0 0 24 24'
					>
						<circle
							className='opacity-25'
							cx='12'
							cy='12'
							r='10'
							stroke='currentColor'
							strokeWidth='4'
							fill='none'
						/>
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						/>
					</svg>
					<span className='text-lg text-gray-600 dark:text-gray-300'>
						Loading analysis...
					</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
				<Card className='w-full max-w-md'>
					<CardHeader>
						<CardTitle className='text-red-600'>Error</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-gray-600 dark:text-gray-300 mb-4'>{error}</p>
						<button
							onClick={() => navigate('/')}
							className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150'
						>
							Go Home
						</button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!analysisData) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			{/* Header */}
			<div className='bg-white dark:bg-gray-800 shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex items-center justify-between'>
						<div>
							<button
								onClick={() => navigate('/')}
								className='text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center space-x-2 mb-2'
							>
								<svg
									className='w-4 h-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M10 19l-7-7m0 0l7-7m-7 7h18'
									/>
								</svg>
								<span>Back to Projects</span>
							</button>
							<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
								{analysisData.projectName}
							</h1>
							<p className='text-gray-600 dark:text-gray-300 mt-1'>
								Analysis Results
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Left Column - Project Information */}
					<div className='lg:col-span-1 space-y-6'>
						{/* Project Details */}
						<Card>
							<CardHeader>
								<CardTitle>Project Information</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Project Name
									</label>
									<p className='text-lg font-semibold text-gray-900 dark:text-white mt-1'>
										{analysisData.projectName}
									</p>
								</div>

								<div>
									<label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Context
									</label>
									<p className='text-gray-600 dark:text-gray-300 leading-relaxed mt-1'>
										{analysisData.context}
									</p>
								</div>

								<div>
									<label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Audio File
									</label>
									<div className='mt-2'>
										<button
											onClick={handleDownloadFile}
											disabled={isDownloading}
											className={`hover:cursor-pointer flex items-center space-x-2 px-4 py-2 ${
												isDownloading
													? 'bg-gray-400 cursor-not-allowed'
													: 'bg-indigo-600 hover:bg-indigo-700'
											} text-white rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
										>
											{isDownloading ? (
												<>
													<svg
														className='animate-spin w-4 h-4'
														viewBox='0 0 24 24'
													>
														<circle
															className='opacity-25'
															cx='12'
															cy='12'
															r='10'
															stroke='currentColor'
															strokeWidth='4'
															fill='none'
														/>
														<path
															className='opacity-75'
															fill='currentColor'
															d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
														/>
													</svg>
													<span className='text-sm'>Downloading...</span>
												</>
											) : (
												<>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
														/>
													</svg>
													<span className='font-mono text-sm'>
														{analysisData.fileKey}
													</span>
												</>
											)}
										</button>
									</div>
								</div>

								<div>
									<label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Project ID
									</label>
									<p className='text-sm font-mono text-gray-600 dark:text-gray-400 mt-1 break-all'>
										{projectUuid}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Analysis Results */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Overall Assessment */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center justify-between'>
									<span>Overall Assessment</span>
									<div className='flex items-center space-x-2'>
										<span className='text-sm text-gray-500 dark:text-gray-400'>
											Score:
										</span>
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
												analysisData.analysis.overall_assessment.score >= 0.8
													? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
													: analysisData.analysis.overall_assessment.score >=
													  0.6
													? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
													: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
											}`}
										>
											{Math.round(
												analysisData.analysis.overall_assessment.score * 100
											)}
											%
										</span>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
										Key Insights
									</h4>
									<p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
										{
											analysisData.analysis.overall_assessment
												.key_insights_summary
										}
									</p>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
										Areas for Improvement
									</h4>
									<ul className='space-y-2'>
										{analysisData.analysis.overall_assessment.areas_for_improving.map(
											(area, index) => (
												<li key={index} className='flex items-start space-x-2'>
													<span className='flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2'></span>
													<span className='text-gray-600 dark:text-gray-300 text-sm'>
														{area}
													</span>
												</li>
											)
										)}
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* Key Points */}
						<Card>
							<CardHeader>
								<CardTitle>Key Points</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className='space-y-3'>
									{analysisData.keyPoints.map((point, index) => (
										<li key={index} className='flex items-start space-x-3'>
											<div className='flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium'>
												{index + 1}
											</div>
											<span className='text-gray-600 dark:text-gray-300 leading-relaxed'>
												{point}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Presentation Breakdown */}
						<Card>
							<CardHeader>
								<CardTitle>Presentation Analysis</CardTitle>
							</CardHeader>
							<CardContent className='space-y-6'>
								{/* Storytelling Coherence */}
								<div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
									<div className='flex items-center justify-between mb-2'>
										<h4 className='text-sm font-medium text-gray-900 dark:text-white'>
											Storytelling Coherence
										</h4>
										<span className='text-sm font-semibold text-indigo-600 dark:text-indigo-400'>
											{Math.round(
												analysisData.analysis.presentation_breakdown
													.storytelling_coherence.score * 100
											)}
											%
										</span>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2'>
										<div
											className='bg-indigo-600 h-2 rounded-full'
											style={{
												width: `${
													analysisData.analysis.presentation_breakdown
														.storytelling_coherence.score * 100
												}%`,
											}}
										></div>
									</div>
									<p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
										{
											analysisData.analysis.presentation_breakdown
												.storytelling_coherence.assessment
										}
									</p>
									<details className='text-sm'>
										<summary className='text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300'>
											View Suggestions
										</summary>
										<ul className='mt-2 space-y-1 ml-4'>
											{analysisData.analysis.presentation_breakdown.storytelling_coherence.suggestions.map(
												(suggestion, index) => (
													<li
														key={index}
														className='text-gray-600 dark:text-gray-300'
													>
														• {suggestion}
													</li>
												)
											)}
										</ul>
									</details>
								</div>

								{/* Listener Motivation */}
								<div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
									<div className='flex items-center justify-between mb-2'>
										<h4 className='text-sm font-medium text-gray-900 dark:text-white'>
											Listener Motivation
										</h4>
										<span className='text-sm font-semibold text-purple-600 dark:text-purple-400'>
											{Math.round(
												analysisData.analysis.presentation_breakdown
													.listener_motivation.score * 100
											)}
											%
										</span>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2'>
										<div
											className='bg-purple-600 h-2 rounded-full'
											style={{
												width: `${
													analysisData.analysis.presentation_breakdown
														.listener_motivation.score * 100
												}%`,
											}}
										></div>
									</div>
									<p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
										{
											analysisData.analysis.presentation_breakdown
												.listener_motivation.assessment
										}
									</p>
									<details className='text-sm'>
										<summary className='text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-800 dark:hover:text-purple-300'>
											View Suggestions
										</summary>
										<ul className='mt-2 space-y-1 ml-4'>
											{analysisData.analysis.presentation_breakdown.listener_motivation.suggestions.map(
												(suggestion, index) => (
													<li
														key={index}
														className='text-gray-600 dark:text-gray-300'
													>
														• {suggestion}
													</li>
												)
											)}
										</ul>
									</details>
								</div>

								{/* Tone of Voice Assessment */}
								<div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
										Tone of Voice Assessment
									</h4>
									<div className='space-y-3'>
										<div>
											<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
												<span>Formal</span>
												<span>Casual</span>
											</div>
											<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative'>
												<div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full'></div>
												<div
													className='absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full top-[-2px]'
													style={{
														left: `${
															analysisData.analysis.presentation_breakdown
																.tone_of_voice_assessment.formal_vs_casual * 100
														}%`,
													}}
												></div>
											</div>
										</div>
										<div>
											<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
												<span>Serious</span>
												<span>Funny</span>
											</div>
											<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative'>
												<div className='absolute inset-0 bg-gradient-to-r from-gray-500 to-yellow-500 rounded-full'></div>
												<div
													className='absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full top-[-2px]'
													style={{
														left: `${
															analysisData.analysis.presentation_breakdown
																.tone_of_voice_assessment.serious_vs_funny * 100
														}%`,
													}}
												></div>
											</div>
										</div>
										<div>
											<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
												<span>Respectful</span>
												<span>Irreverent</span>
											</div>
											<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative'>
												<div className='absolute inset-0 bg-gradient-to-r from-green-500 to-red-500 rounded-full'></div>
												<div
													className='absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full top-[-2px]'
													style={{
														left: `${
															analysisData.analysis.presentation_breakdown
																.tone_of_voice_assessment
																.respectful_vs_irreverent * 100
														}%`,
													}}
												></div>
											</div>
										</div>
										<div>
											<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
												<span>Matter-of-fact</span>
												<span>Enthusiastic</span>
											</div>
											<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative'>
												<div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full'></div>
												<div
													className='absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full top-[-2px]'
													style={{
														left: `${
															analysisData.analysis.presentation_breakdown
																.tone_of_voice_assessment
																.matter_of_fact_vs_enthusiastic * 100
														}%`,
													}}
												></div>
											</div>
										</div>
									</div>
								</div>

								{/* Closing Statement */}
								<div>
									<div className='flex items-center justify-between mb-2'>
										<h4 className='text-sm font-medium text-gray-900 dark:text-white'>
											Closing Statement Engagement
										</h4>
										<span className='text-sm font-semibold text-green-600 dark:text-green-400'>
											{Math.round(
												analysisData.analysis.presentation_breakdown
													.closing_statement_engagement.score * 100
											)}
											%
										</span>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2'>
										<div
											className='bg-green-600 h-2 rounded-full'
											style={{
												width: `${
													analysisData.analysis.presentation_breakdown
														.closing_statement_engagement.score * 100
												}%`,
											}}
										></div>
									</div>
									<p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
										{
											analysisData.analysis.presentation_breakdown
												.closing_statement_engagement.assessment
										}
									</p>
									<details className='text-sm'>
										<summary className='text-green-600 dark:text-green-400 cursor-pointer hover:text-green-800 dark:hover:text-green-300'>
											View Suggestions
										</summary>
										<ul className='mt-2 space-y-1 ml-4'>
											{analysisData.analysis.presentation_breakdown.closing_statement_engagement.suggestions.map(
												(suggestion, index) => (
													<li
														key={index}
														className='text-gray-600 dark:text-gray-300'
													>
														• {suggestion}
													</li>
												)
											)}
										</ul>
									</details>
								</div>
							</CardContent>
						</Card>

						{/* Overused Elements */}
						<Card>
							<CardHeader>
								<CardTitle>Overused Elements</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
										Most Frequent Keywords
									</h4>
									<div className='flex flex-wrap gap-2'>
										{analysisData.analysis.presentation_breakdown.overused_elements.keywords.map(
											(keyword, index) => (
												<span
													key={index}
													className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
												>
													{keyword.word}
													<span className='ml-1 text-xs font-semibold'>
														({keyword.count})
													</span>
												</span>
											)
										)}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
										Repeated Expressions
									</h4>
									<div className='flex flex-wrap gap-2'>
										{analysisData.analysis.presentation_breakdown.overused_elements.expressions.map(
											(expression, index) => (
												<span
													key={index}
													className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
												>
													"{expression.expression}"
													<span className='ml-1 text-xs font-semibold'>
														({expression.count})
													</span>
												</span>
											)
										)}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
										Improvement Suggestions
									</h4>
									<ul className='space-y-2'>
										{analysisData.analysis.presentation_breakdown.overused_elements.suggestions.map(
											(suggestion, index) => (
												<li key={index} className='flex items-start space-x-2'>
													<span className='flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2'></span>
													<span className='text-gray-600 dark:text-gray-300 text-sm'>
														{suggestion}
													</span>
												</li>
											)
										)}
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* Emotional Analysis */}
						<Card>
							<CardHeader>
								<CardTitle>Emotional Analysis</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
										Identified Emotions
									</h4>
									<div className='space-y-3'>
										{analysisData.analysis.emotional_analysis.identified_emotions.map(
											(emotion, index) => (
												<div
													key={index}
													className='border border-gray-200 dark:border-gray-700 rounded-lg p-3'
												>
													<div className='flex items-center space-x-2 mb-2'>
														<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
															{emotion.emotion}
														</span>
													</div>
													<blockquote className='text-sm text-gray-600 dark:text-gray-300 italic border-l-4 border-blue-300 pl-3'>
														"{emotion.quotes}"
													</blockquote>
												</div>
											)
										)}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
										Overall Emotional Arc
									</h4>
									<p className='text-gray-600 dark:text-gray-300 leading-relaxed text-sm'>
										{
											analysisData.analysis.emotional_analysis
												.overall_emotional_arc
										}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Transcription */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center justify-between'>
									<span>Full Transcription</span>
									<div className='flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400'>
										<span>
											Duration:{' '}
											{Math.round(
												analysisData.transcript.durationMilliseconds / 1000 / 60
											)}{' '}
											min
										</span>
										<span>Locale: {analysisData.transcript.locale}</span>
										<span
											className={`px-2 py-1 rounded-full ${
												analysisData.transcript.confidence >= 0.8
													? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
													: analysisData.transcript.confidence >= 0.6
													? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
													: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
											}`}
										>
											Confidence:{' '}
											{Math.round(analysisData.transcript.confidence * 100)}%
										</span>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto border'>
									<p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm'>
										{analysisData.transcript.text}
									</p>
								</div>
								<p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
									Scroll to view the complete transcription
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analysis;
