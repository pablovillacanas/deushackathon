import { testAzureConnection } from '@/utils/azureStorage';

export const TestAzureConnection = () => {
  const handleTestConnection = async () => {
    try {
      const isConnected = await testAzureConnection();
      if (isConnected) {
        alert('✅ Azure Blob Storage connection successful!');
      } else {
        alert('❌ Azure Blob Storage connection failed. Check your credentials.');
      }
    } catch (error) {
      alert('❌ Error testing connection: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <button
      onClick={handleTestConnection}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Test Azure Connection
    </button>
  );
};
