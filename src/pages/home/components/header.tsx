import { PlusIcon } from '@/components/ui/icons';

type Props = {
	onOpenModal: () => void;
};

export const Header = ({ onOpenModal }: Props) => (
	<div className='bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white'>
		<nav className='bg-gray-50 dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center h-full'>
						<img 
							src="/logo-thothor.svg" 
							alt="Thothor Logo" 
							className="h-full w-auto"
						/>
					</div>
					<div>
						<button
							onClick={onOpenModal}
							className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center'
						>
							<PlusIcon />
							New Project
						</button>
					</div>
				</div>
			</div>
		</nav>
	</div>
);

export default Header;
