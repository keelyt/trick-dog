import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import FormError from '../form/FormError';

import styles from './GoogleLoginButton.module.scss';

export default function GoogleLoginButton(): JSX.Element {
  const { login } = useAuth();
  const divRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const handleCallbackResponse = (response: google.accounts.id.CredentialResponse) => {
    login.mutate(response.credential);
  };

  useEffect(() => {
    if (scriptLoaded) return;

    const initialize = () => {
      if (!divRef.current) return;

      setScriptLoaded(true);
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });

      const buttonConfiguration: google.accounts.id.GsiButtonConfiguration = {
        shape: 'rectangular',
        size: 'large',
        theme: 'outline',
        type: 'standard',
      };

      window.google.accounts.id.renderButton(divRef.current, buttonConfiguration);
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
    <div className={styles.button}>
      <div ref={divRef} />
      {login.isError && (
        <FormError
          errorMessage={
            login.error instanceof Error ? login.error.message : 'Unknown error. Please try again.'
          }
        />
      )}
    </div>
  );
}
