"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * Custom hook for handling async operations with loading and error states
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} - { execute, loading, error, data }
 */
export function useAsync(asyncFunction, options = {}) {
  const {
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = "Operation completed successfully",
    errorMessage = "Something went wrong. Please try again.",
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction(...params);
        setData(result);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMsg = err?.message || errorMessage;
        setError(errorMsg);

        if (showErrorToast) {
          toast.error(errorMsg);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError, showErrorToast, showSuccessToast, successMessage, errorMessage]
  );

  return {
    execute,
    loading,
    error,
    data,
    setData,
    setError,
  };
}

/**
 * Hook specifically for API calls with better error handling
 */
export function useApiCall(apiFunction, options = {}) {
  const enhancedOptions = {
    ...options,
    onError: (error) => {
      // Log API errors
      console.error("API Error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      if (options.onError) {
        options.onError(error);
      }
    },
  };

  return useAsync(apiFunction, enhancedOptions);
}
