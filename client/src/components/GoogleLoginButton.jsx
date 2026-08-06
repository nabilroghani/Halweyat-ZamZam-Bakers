import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleLoginButton({ redirectPath = '/my-orders', label = 'Continue with Google' }) {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleBtnRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '800631608815-bdgiseqqngsi0g4bjglo4btsnm67qrhp.apps.googleusercontent.com';

  useEffect(() => {
    let isMounted = true;

    const initGoogleGsi = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;

      try {
        // Initialize once
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          auto_select: false,
          callback: async (response) => {
            if (!response.credential) {
              if (isMounted) setError('Google Authentication failed: No token received.');
              return;
            }

            if (isMounted) {
              setLoading(true);
              setError('');
            }

            try {
              const userData = await googleLogin({ token: response.credential });
              if (userData.role === 'admin' || userData.role === 'receptionist') {
                navigate('/admin/dashboard');
              } else {
                navigate(redirectPath);
              }
            } catch (err) {
              if (isMounted) setError(err.message || 'Google authentication verification failed.');
            } finally {
              if (isMounted) setLoading(false);
            }
          }
        });

        // Render official native Google Sign-In button directly
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'left',
          width: 320
        });
      } catch (err) {
        console.error('Google GIS Init Error:', err);
      }
    };

    // Retry if SDK script is still loading asynchronously
    const timer = setTimeout(initGoogleGsi, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [googleClientId, googleLogin, navigate, redirectPath]);

  return (
    <div className="space-y-2.5 flex flex-col items-center justify-center w-full">
      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-xs text-amber-400 font-bold animate-pulse py-2">
          Verifying Google Credentials...
        </div>
      )}

      {/* Official Native Google Sign-In Button Container */}
      <div 
        ref={googleBtnRef} 
        className="flex justify-center w-full min-h-[44px]"
      />

      <p className="text-[10px] text-gray-500 text-center leading-relaxed">
        Secured by official Google Identity Services.<br/>
        <span className="text-amber-400/80 font-mono">Current Origin: {window.location.origin}</span>
      </p>
    </div>
  );
}
