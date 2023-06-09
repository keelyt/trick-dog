import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import fetchWithError from '../../helpers/fetchWithError';
import FormError from '../form/FormError';

export default function GoogleLoginButton() {
  const { login } = useAuth();
  const divRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCallbackResponse = async (response: google.accounts.id.CredentialResponse) => {
    setError(null);
    console.log(response);
    console.log('Encoded JWT ID token: ', response.credential);
    try {
      await fetchWithError('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });
      // TODO: Handle remainder of login.
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error. Please try again.');
    }
  };

  useEffect(() => {
    if (scriptLoaded) return;

    const initialize = () => {
      if (!divRef.current) return;

      setScriptLoaded(true);
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
        login_uri: 'api/auth/google',
      });
      window.google.accounts.id.renderButton(divRef.current, {
        shape: 'pill',
        size: 'large',
        theme: 'filled_blue',
        type: 'standard',
      });
    };

    // Add the google identity script.
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initialize;
    script.async = true;
    script.defer = true;
    script.id = 'google-client-script';
    document.body.appendChild(script);

    // Return cleanup function.
    return () => {
      document.body.removeChild(script);
    };
  }, [divRef.current]);

  return (
    <div>
      <div ref={divRef} />
      {error && <FormError errorMessage={error} />}
    </div>
  );
}
