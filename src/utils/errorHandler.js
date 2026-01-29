import { toast } from "sonner";

/**
 * Handle API errors and show appropriate messages
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message
 * @returns {string} - Error message to display
 */
export function handleApiError(error, defaultMessage = "Something went wrong") {
  console.error("API Error:", error);

  // Network errors
  if (!navigator.onLine) {
    return "No internet connection. Please check your network.";
  }

  // Timeout errors
  if (error.name === "AbortError" || error.message?.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please login again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please slow down.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return data?.message || defaultMessage;
    }
  }

  // Custom error messages
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Wrapper for async API calls with error handling
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Promise} - The result or throws error
 */
export async function safeApiCall(apiCall, options = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = "Success!",
    errorMessage = "Something went wrong",
    onSuccess,
    onError,
  } = options;

  try {
    const result = await apiCall();

    if (showSuccessToast) {
      toast.success(successMessage);
    }

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    const message = handleApiError(error, errorMessage);

    if (showErrorToast) {
      toast.error(message);
    }

    if (onError) {
      onError(error);
    }

    throw error;
  }
}

/**
 * Create a fetch wrapper with timeout and error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Request timeout in ms (default: 30000)
 * @returns {Promise} - Fetch response
 */
export async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = response;
      throw error;
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Retry failed API calls with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - Result of function
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}
