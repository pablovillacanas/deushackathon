type ProjectCardProps = {
	project: {
		id: string;
		name: string;
		duration: string;
		insights: string;
		file?: File | null;
		context?: string;
	};
	onViewDetails: (id: string) => void;
};

export const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => (
	<div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col'>
		<div className='p-6 flex-grow'>
			<h3 className='text-xl font-semibold text-indigo-700 mb-2'>
				{project.name}
			</h3>
			<p className='text-sm text-gray-600 mb-1'>
				<span className='font-medium'>Duration:</span> {project.duration}
			</p>
			<p className='text-sm text-gray-600 mb-1'>
				<span className='font-medium'>Insights:</span> {project.insights}
			</p>
			<p
				className='text-sm text-gray-600 mb-3 truncate'
				title={project.file ? project.file.name : 'No file'}
			>
				<span className='font-medium'>File:</span>{' '}
				{project.file ? project.file.name : 'N/A'}
			</p>
			<p
				className='text-sm text-gray-500 italic truncate'
				title={project.context}
			>
				<span className='font-medium'>Context:</span>{' '}
				{project.context || 'No context provided.'}
			</p>
		</div>
		<div className='bg-gray-50 p-4 border-t border-gray-200'>
			<button
				onClick={() => onViewDetails(project.id)}
				className='text-sm text-indigo-600 hover:text-indigo-800 font-medium w-full text-left'
			>
				View Details
			</button>
		</div>
	</div>
);
