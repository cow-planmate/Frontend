import { useCallback, useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

const DEFAULT_INVITATION_SSE_PATH = '/api/sse/subscribe';
const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const CUSTOM_EVENT_TYPES = [
  'invitation',
  'invite',
  'collaboration-request',
  'notification',
];

const resolveSseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBaseUrl}${DEFAULT_INVITATION_SSE_PATH}`;
};

export function useInvitationSse({ enabled, onInvitationEvent }) {
  const sourceRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY_MS);
  const shouldReconnectRef = useRef(false);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    clearReconnectTimer();

    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, [clearReconnectTimer]);

  const scheduleReconnect = useCallback(
    (connect) => {
      if (!shouldReconnectRef.current) {
        return;
      }

      clearReconnectTimer();
      const delay = reconnectDelayRef.current;

      reconnectTimerRef.current = setTimeout(() => {
        connect().catch(error => {
          console.log('[SSE] Reconnect attempt failed:', error);
        });
      }, delay);

      reconnectDelayRef.current = Math.min(
        reconnectDelayRef.current * 2,
        MAX_RECONNECT_DELAY_MS
      );
    },
    [clearReconnectTimer]
  );

  const connect = useCallback(async () => {
    disconnect();

    if (!shouldReconnectRef.current) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      scheduleReconnect(connect);
      return;
    }

    const sseUrlWithToken = `${resolveSseUrl()}?token=${token}`;
    const source = new EventSourcePolyfill(sseUrlWithToken, {
      heartbeatTimeout: 86400000,
    });

    const onOpen = () => {
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY_MS;
      console.log('[SSE] Invitation stream connected');
    };

    const handleIncomingEvent = (event) => {
      const rawData = event.data;
      if (!rawData || rawData === 'ping') {
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(rawData);
      } catch (_error) {
        // If not JSON (e.g. 'connected'), pass the raw string
        parsedData = rawData;
      }

      Promise.resolve(onInvitationEvent(parsedData, event.type)).catch(error => {
        console.log('[SSE] Invitation event handler failed:', error);
      });
    };

    const onMessage = (event) => {
      handleIncomingEvent(event);
    };

    const onCustomEvent = (event) => {
      if (
        typeof event === 'object' &&
        event !== null &&
        'data' in event
      ) {
        handleIncomingEvent(event);
      }
    };

    const onError = (event) => {
      // EventSourcePolyfill attaches the HTTP status code to event.status on error usually.
      const xhrStatus = event.status ? String(event.status) : 'unknown';

      console.log(`[SSE] Invitation stream error: status=${xhrStatus}`);

      // If server denies stream access, stop reconnect loop and rely on polling.
      if (xhrStatus === '401' || xhrStatus === '403') {
        shouldReconnectRef.current = false;
        disconnect();
        return;
      }

      disconnect();
      scheduleReconnect(connect);
    };

    source.addEventListener('open', onOpen);
    source.addEventListener('message', onMessage);
    source.addEventListener('error', onError);

    // React Web EventSource doesn't have a 'close' event like react-native-sse. 
    // It emits an 'error' event and then reconnects.

    CUSTOM_EVENT_TYPES.forEach(eventType => {
      source.addEventListener(eventType, onCustomEvent);
    });

    sourceRef.current = source;
  }, [disconnect, onInvitationEvent, scheduleReconnect]);

  useEffect(() => {
    shouldReconnectRef.current = enabled;

    if (enabled) {
      connect().catch(error => {
        console.log('[SSE] Initial connection failed:', error);
      });
    } else {
      disconnect();
    }

    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [connect, disconnect, enabled]);
}
