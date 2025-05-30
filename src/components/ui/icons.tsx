const PlusIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='h-5 w-5 inline-block mr-2'
		viewBox='0 0 20 20'
		fill='currentColor'
	>
		<path
			fillRule='evenodd'
			d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
			clipRule='evenodd'
		/>
	</svg>
);

const CloseIcon = () => (
	<svg
		className='w-6 h-6'
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='2'
			d='M6 18L18 6M6 6l12 12'
		></path>
	</svg>
);

const UploadIcon = () => (
	<svg
		className='mx-auto h-12 w-12 text-gray-400'
		stroke='currentColor'
		fill='none'
		viewBox='0 0 48 48'
		aria-hidden='true'
	>
		<path
			d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

const NoProjectsIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='mx-auto h-12 w-12 text-gray-400'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth='1'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
		/>
	</svg>
);

const SuccessIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth='2'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		/>
	</svg>
);

const ErrorIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth='2'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		/>
	</svg>
);

const InfoIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		className='h-6 w-6'
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth='2'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		/>
	</svg>
);

export {
	PlusIcon,
	CloseIcon,
	UploadIcon,
	NoProjectsIcon,
	SuccessIcon,
	ErrorIcon,
	InfoIcon,
};
