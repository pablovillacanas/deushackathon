import { BlobServiceClient } from '@azure/storage-blob';

// Azure Storage configuration with SAS token
const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const blobEndpoint = import.meta.env.VITE_AZURE_BLOB_ENDPOINT;
const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
const containerName = import.meta.env.VITE_AZURE_AUDIO_CONTAINER_NAME;

if (!accountName || !blobEndpoint || !sasToken || !containerName) {
	throw new Error(
		'Azure Storage configuration is missing. Please check your environment variables.'
	);
}

// Create a BlobServiceClient using SAS token
const blobServiceClient = new BlobServiceClient(`${blobEndpoint}?${sasToken}`);

export interface UploadResult {
	success: boolean;
	url?: string;
	error?: string;
	fileName?: string;
}

/**
 * Upload a file to Azure Blob Storage
 * @param file - The file to upload
 * @param fileName - Optional custom filename (if not provided, will use original filename with timestamp)
 * @returns Promise with upload result
 */
export const uploadFileToAzure = async (
	file: File,
	fileName?: string
): Promise<UploadResult> => {
	try {
		const finalFileName = fileName || `${Date.now()}_${file.name}`;
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlockBlobClient(finalFileName);

		const uploadOptions = {
			blobHTTPHeaders: {
				blobContentType: file.type,
			},
			metadata: {
				uploadedAt: new Date().toISOString(),
				originalName: file.name,
				size: file.size.toString(),
			},
		};

		const uploadResponse = await blobClient.uploadData(file, uploadOptions);

		if (uploadResponse.errorCode) {
			return {
				success: false,
				error: `Upload failed with error code: ${uploadResponse.errorCode}`,
			};
		}

		return {
			success: true,
			url: blobClient.url,
			fileName: finalFileName,
		};
	} catch (error) {
		console.error('Error uploading file to Azure:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred during upload',
		};
	}
};

/**
 * Delete a file from Azure Blob Storage
 * @param fileName - The name of the file to delete
 * @returns Promise with deletion result
 */
export const deleteFileFromAzure = async (
	fileName: string
): Promise<UploadResult> => {
	try {
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlockBlobClient(fileName);

		const deleteResponse = await blobClient.deleteIfExists();

		return {
			success: deleteResponse.succeeded,
			fileName,
		};
	} catch (error) {
		console.error('Error deleting file from Azure:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred during deletion',
		};
	}
};

/**
 * Check if the Azure Blob Storage configuration is valid
 * @returns Promise<boolean>
 */
export const testAzureConnection = async (): Promise<boolean> => {
	try {
		const containerClient = blobServiceClient.getContainerClient(containerName);
		await containerClient.getProperties();
		return true;
	} catch (error) {
		console.error('Azure connection test failed:', error);
		return false;
	}
};

/**
 * Download a file from Azure Blob Storage
 * @param fileName - The name of the file to download
 * @returns Promise<boolean> - Whether the download was successful
 */
export const downloadFileFromAzure = async (fileName: string): Promise<boolean> => {
	try {
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlockBlobClient(fileName);

		// Get the blob URL for downloading
		const downloadResponse = await blobClient.download();
		
		if (!downloadResponse.readableStreamBody) {
			console.error('No readable stream body found');
			return false;
		}

		// Convert stream to blob - using proper browser API with type assertion
		const stream = downloadResponse.readableStreamBody as unknown as ReadableStream<Uint8Array>;
		
		// For modern browsers that support Response.body
		if (typeof Response !== 'undefined' && 'body' in Response.prototype) {
			try {
				const response = new Response(stream);
				const blob = await response.blob();
				
				// Create download link
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				
				// Cleanup
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
				
				return true;
			} catch (responseError) {
				console.warn('Response API failed, falling back to manual stream reading:', responseError);
			}
		}
		
		// Fallback for older browsers or if Response API fails
		try {
			const reader = stream.getReader();
			const chunks: Uint8Array[] = [];
			
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) chunks.push(value);
			}

			const blob = new Blob(chunks, { 
				type: downloadResponse.contentType || 'application/octet-stream' 
			});

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			
			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			
			return true;
		} catch (streamError) {
			console.error('Stream reading failed:', streamError);
			return false;
		}
		
	} catch (error) {
		console.error('Error downloading file from Azure:', error);
		return false;
	}
};

/**
 * Get the direct download URL for a file in Azure Blob Storage
 * @param fileName - The name of the file
 * @returns string - The direct URL to the file
 */
export const getFileDownloadUrl = (fileName: string): string => {
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobClient = containerClient.getBlockBlobClient(fileName);
	return blobClient.url;
};

/**
 * Open file in new tab for download (alternative download method)
 * @param fileName - The name of the file to download
 */
export const openFileInNewTab = (fileName: string): void => {
	const url = getFileDownloadUrl(fileName);
	window.open(url, '_blank');
};
