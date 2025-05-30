import { NewProjectModal } from '@/components/NewProjectModal';
import { useProjects } from '@/hooks/useProjects';
import Footer from '@/pages/home/components/footer.tsx';
import Header from '@/pages/home/components/header';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const [showNewProjectModal, setShowNewProjectModal] = useState(false);
	const navigate = useNavigate();
	const { 
		projects, 
		isLoading, 
		error, 
		addProject, 
		projectCount 
	} = useProjects();

	return (
		<div className='min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white'>
			<Header onOpenModal={() => setShowNewProjectModal(true)} />
			
			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Your Projects
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Manage and analyze your transcript projects
					</p>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => (
						<div
							key={project.uuid}
							onClick={() => navigate(`/analysis/${project.uuid}`)}
							className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{project.projectName}
									</h3>
									{project.status && (
										<span className={`px-2 py-1 text-xs rounded-full ${
											project.status === 'COMPLETED' 
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
												: project.status === 'PENDING'
												? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
												: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
										}`}>
											{project.status}
										</span>
									)}
								</div>
								<p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
									{project.context}
								</p>
								<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
									<span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
										{project.fileKey}
									</span>
									<span>{project.createdAt}</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{projects.length === 0 && !isLoading && (
					<div className="text-center py-12">
						<div className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No projects yet
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-4">
							Get started by creating your first transcript analysis project
						</p>
						<button
							onClick={() => setShowNewProjectModal(true)}
							className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
						>
							Create Your First Project
						</button>
					</div>
				)}
			</main>
			
			<NewProjectModal
				isOpen={showNewProjectModal}
				onClose={() => setShowNewProjectModal(false)}
				onAddProject={async (project) => {
					try {
						console.log('Creating project:', project);
						const newProject = await addProject(project);
						console.log('Project created successfully:', newProject);
						
						// Stay on home page to see the new project in the list
						// The modal will close automatically and show the updated project list
					} catch (error) {
						console.error('Error creating project:', error);
						// You could add a toast notification here
					}
				}}
			></NewProjectModal>

			<Footer />
		</div>
	);
};

export default Home;
