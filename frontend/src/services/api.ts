import axios, { AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface ErrorResponse {
  detail?: string;
}

export const initializeModel = async (
  hfToken: string,
  onProgress: (progress: number, status: string) => void
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/initialize`,
      { hf_token: hfToken },
      {
        timeout: 300000, // 5 minutes timeout
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted, `Downloading model: ${percentCompleted}%`);
          }
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to initialize the Mathstral model');
    }

    onProgress(100, 'Model initialized successfully');
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Invalid or unauthorized Hugging Face token');
        } else {
          const errorData = error.response.data as ErrorResponse;
          const errorMessage = errorData.detail || 'An error occurred while initializing the Mathstral model';
          if (errorMessage.includes("out of memory")) {
            throw new Error('The model initialization failed due to insufficient memory. Please try again or contact support.');
          }
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        throw new Error('No response received from server. The initialization process might still be ongoing.');
      } else {
        throw new Error('Error setting up the request');
      }
    } else {
      throw new Error('An unexpected error occurred during initialization');
    }
  }
};

export const generateResponse = async (
  input: string,
  options: { 
    maxNewTokens: number; 
    temperature: number;
    topP: number;
    topK: number;
  },
  callbacks?: {
    onUpdate?: (result: string) => void;
    onFinish?: () => void;
    onError?: (error: string) => void;
  }
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: input,
        max_new_tokens: options.maxNewTokens,
        temperature: options.temperature,
        top_p: options.topP,
        top_k: options.topK,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const decodedChunk = decoder.decode(value, { stream: true });
      const lines = decodedChunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.finished) {
              callbacks?.onFinish?.();
              return;
            } else if (data.error) {
              console.error('Error from backend:', data.error);
              callbacks?.onError?.(data.error);
              throw new Error(data.error);
            } else {
              accumulatedResponse += data.token;
              callbacks?.onUpdate?.(accumulatedResponse);
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            callbacks?.onError?.('Error parsing response from server');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in generateResponse:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    callbacks?.onError?.(errorMessage);
    throw error;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};