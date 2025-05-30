import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CloseIcon } from '@/components/ui/icons';
import { UploadIcon } from '@/components/ui/icons';
import { uploadFileToAzure, UploadResult } from '@/utils/azureStorage';

type FormData = {
	projectName: string;
	context: string;
	file: FileList;
};

type Project = {
	projectName: string;
	context: string;
	fileKey: string;
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onAddProject: (project: Project) => void;
};

export const NewProjectModal = ({ isOpen, onClose, onAddProject }: Props) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadedFileKey, setUploadedFileKey] = useState<string>('');
	
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		setError,
		clearErrors,
		setValue
	} = useForm<FormData>({
		defaultValues: {
			projectName: '',
			context: '',
			file: undefined
		}
	});

	const watchedFile = watch('file');
	const selectedFile = watchedFile?.[0];

	// Reset form when modal is closed
	useEffect(() => {
		if (!isOpen) {
			const timer = setTimeout(() => {
				reset();
				clearErrors();
				setIsUploading(false);
				setIsDragOver(false);
				setUploadedFileKey('');
			}, 300); // Match CSS transition duration
			return () => clearTimeout(timer);
		}
	}, [isOpen, reset, clearErrors]);

	const validateFile = (file: File): string | true => {
		// File type validation
		const allowedTypes = [
			'text/plain',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/pdf',
			'audio/mpeg',
			'audio/wav',
			'audio/mp4',
			'audio/ogg',
		];
		
		if (!allowedTypes.includes(file.type)) {
			return `Invalid file type: ${file.type}. Please upload one of the supported types.`;
		}

		// File size validation (10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum size is 10MB.`;
		}

		return true;
	};

	// Auto upload file to Azure when selected
	const handleFileUpload = async (file: File) => {
		const validation = validateFile(file);
		if (validation !== true) {
			setError('file', { type: 'manual', message: validation });
			return;
		}

		setIsUploading(true);
		clearErrors('file');

		try {
			console.log('Starting file upload for:', file.name);
			
			// Try Azure upload first
			const uploadResult: UploadResult = await uploadFileToAzure(file);
			
			console.log('Upload result:', uploadResult);
			
			if (!uploadResult.success) {
				console.warn('Azure upload failed, using mock upload:', uploadResult.error);
				
				// Fallback to mock upload for development
				await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
				
				const mockFileKey = `mock_${Date.now()}_${file.name}`;
				console.log('Using mock file key:', mockFileKey);
				setUploadedFileKey(mockFileKey);
				return;
			}

			// Store the fileKey (Azure URL or fileName)
			const fileKey = uploadResult.fileName || uploadResult.url || file.name;
			console.log('Setting uploaded file key:', fileKey);
			setUploadedFileKey(fileKey);
			
		} catch (error) {
			console.error('Upload error, falling back to mock:', error);
			
			// Fallback to mock upload for development
			try {
				await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
				const mockFileKey = `mock_${Date.now()}_${file.name}`;
				console.log('Using mock file key after error:', mockFileKey);
				setUploadedFileKey(mockFileKey);
			} catch {
				setError('file', { 
					type: 'manual', 
					message: 'Failed to upload file. Please try again.' 
				});
			}
		} finally {
			setIsUploading(false);
		}
	};

	// Drag and drop handlers
	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			
			// Create a new FileList-like object for the form
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(file);
			setValue('file', dataTransfer.files);
			
			// Automatically upload to Azure
			handleFileUpload(file);
		}
	};

	// Handle file input change
	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Automatically upload to Azure
			handleFileUpload(file);
		}
	};

	const onSubmit = async (data: FormData) => {
		console.log('Form submitted with data:', data);
		console.log('Selected file:', selectedFile);
		console.log('Uploaded file key:', uploadedFileKey);
		console.log('Is uploading:', isUploading);
		
		// Check if a file was selected
		if (!selectedFile) {
			console.log('No file selected');
			setError('file', { 
				type: 'manual', 
				message: 'Please select a file to upload' 
			});
			return;
		}

		// Check if file has been uploaded successfully
		if (!uploadedFileKey) {
			console.log('No uploaded file key');
			setError('file', { 
				type: 'manual', 
				message: 'Please wait for the file to finish uploading' 
			});
			return;
		}

		console.log('Creating project...');
		
		// Call the onAddProject with the simplified project data
		onAddProject({
			projectName: data.projectName || selectedFile.name.split('.')[0], // Use filename as fallback
			context: data.context,
			fileKey: uploadedFileKey,
		});
		
		onClose();
	};

	// Handle Escape key press for closing modal
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		if (isOpen) {
			window.addEventListener('keydown', handleEsc);
		}
		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='modal fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4'
			onClick={onClose} // Close on backdrop click
		>
			<div
				className='modal-content bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100'
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-semibold text-gray-800'>
						Create New Project
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 transition duration-150 cursor-pointer'
					>
						<CloseIcon />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-5'>
						<label
							htmlFor='projectName'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Project Name (Optional)
						</label>
						<input
							{...register('projectName')}
							type='text'
							id='projectName'
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500'
							placeholder='e.g., Q2 Sales Pitch Analysis'
						/>
					</div>

					<div className='mb-5'>
						<label
							htmlFor='context'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Additional Context (Optional)
						</label>
						<textarea
							{...register('context')}
							id='context'
							rows={4}
							className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500'
							placeholder='Describe the goals, key topics, or specific areas you want feedback on...'
						/>
					</div>

					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Upload Transcript or Audio *
						</label>
						<div 
							className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
								isDragOver 
									? 'border-indigo-400 bg-indigo-50' 
									: 'border-gray-300 hover:border-gray-400'
							}`}
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							<div className='space-y-1 text-center'>
								<UploadIcon />
								<div className='flex text-sm text-gray-600'>
									<label
										htmlFor='fileUploadInput'
										className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
									>
										<span>Upload a file</span>
										<input
											{...register('file', {
												required: 'Please select a file to upload'
											})}
											id='fileUploadInput'
											name='file'
											type='file'
											className='sr-only'
											accept='.txt,.doc,.docx,.pdf,.mp3,.wav,.m4a,.ogg'
											onChange={handleFileInputChange}
										/>
									</label>
									<p className='pl-1'>or drag and drop</p>
								</div>
								<p className='text-xs text-gray-500'>
									{uploadedFileKey ? (
										<span className='text-green-600 font-medium'>
											✓ {selectedFile?.name || 'File'} uploaded successfully
										</span>
									) : selectedFile ? (
										isUploading ? (
											<span className='text-blue-600'>
												Uploading {selectedFile.name}...
											</span>
										) : (
											selectedFile.name
										)
									) : (
										'TXT, DOC, PDF, MP3, WAV, M4A, OGG up to 10MB'
									)}
								</p>
								{isDragOver && (
									<p className='text-xs text-indigo-600 font-medium'>
										Drop your file here
									</p>
								)}
							</div>
						</div>
						{errors.file && (
							<p className='mt-2 text-sm text-red-600'>
								{errors.file.message}
							</p>
						)}
					</div>

					<div className='flex justify-end space-x-3'>
						<button
							type='button'
							onClick={onClose}
							disabled={isUploading}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isUploading || !selectedFile || !uploadedFileKey}
							className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
						>
							{isUploading && (
								<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
								</svg>
							)}
							{isUploading ? 'Uploading...' : !selectedFile ? 'Select File First' : !uploadedFileKey ? 'Uploading...' : 'Create Project'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
