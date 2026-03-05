"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  permissionStatus: "granted" | "denied" | "prompt" | "unknown";
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
  watch: false,
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
    loading: true,
    permissionStatus: "unknown",
  });

  const watchIdRef = useRef<number | null>(null);
  const mergedOptions = { ...defaultOptions, ...options };

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      return "unknown";
    }
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state as "granted" | "denied" | "prompt";
    } catch {
      return "unknown";
    }
  }, []);

  // Handle successful position
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      error: null,
      loading: false,
      permissionStatus: "granted",
    });
  }, []);

  // Handle error
  const handleError = useCallback((error: GeolocationPositionError) => {
    const permissionStatus = error.code === 1 ? "denied" : "unknown";
    setState((prev) => ({
      ...prev,
      error,
      loading: false,
      permissionStatus: permissionStatus as "granted" | "denied" | "prompt" | "unknown",
    }));
  }, []);

  // Get current position once
  const getCurrentPosition = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          code: 2,
          message: "Geolocation is not supported by this browser",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge,
      }
    );
  }, [handleSuccess, handleError, mergedOptions.enableHighAccuracy, mergedOptions.timeout, mergedOptions.maximumAge]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    // Clear existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: mergedOptions.enableHighAccuracy,
        timeout: mergedOptions.timeout,
        maximumAge: mergedOptions.maximumAge,
      }
    );
  }, [handleSuccess, handleError, mergedOptions.enableHighAccuracy, mergedOptions.timeout, mergedOptions.maximumAge]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      const permission = await checkPermission();
      setState((prev) => ({ ...prev, permissionStatus: permission }));

      if (mergedOptions.watch) {
        startWatching();
      } else {
        getCurrentPosition();
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      stopWatching();
    };
  }, []);

  // Refresh function to get fresh GPS reading
  const refresh = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    ...state,
    refresh,
    startWatching,
    stopWatching,
    isWatching: watchIdRef.current !== null,
    coords:
      state.latitude !== null && state.longitude !== null
        ? { lat: state.latitude, lng: state.longitude }
        : null,
    // Formatted accuracy string
    accuracyText: state.accuracy
      ? state.accuracy < 100
        ? `${Math.round(state.accuracy)}m`
        : `${(state.accuracy / 1000).toFixed(1)}km`
      : null,
  };
}
