import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthService } from '../services/api';
import { FiShield, FiX, FiCopy, FiCheck, FiRefreshCw, FiKey, FiLock, FiTerminal, FiCheckCircle } from 'react-icons/fi';

export default function JwtTokenInspector() {
  const { isJwtModalOpen, setJwtModalOpen, token, user, getDecodedToken } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  if (!isJwtModalOpen) return null;

  const currentToken = token || localStorage.getItem('zamzam_auth_token');
  const decodedPayload = getDecodedToken();

  const handleCopy = () => {
    if (currentToken) {
      navigator.clipboard.writeText(currentToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await AuthService.verifyToken();
      setVerifyResult({ success: true, data: res });
    } catch (err) {
      setVerifyResult({ success: false, error: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121218] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <FiShield className="text-2xl animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">JWT Security Inspector</h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FiLock className="text-[10px]" /> Active HS256
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">JSON Web Token Authorization & Cryptographic Claim Inspector</p>
            </div>
          </div>

          <button
            onClick={() => setJwtModalOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Token Status Badge */}
        {!currentToken ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-300 text-xs text-center space-y-2">
            <FiKey className="mx-auto text-2xl text-amber-400" />
            <p className="font-bold">No Active JWT Token Found</p>
            <p className="text-gray-400">Please Sign In or Register to view and test live JWT Bearer Token claims.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Raw Token Box */}
            <div className="bg-[#0b0b0f] border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <FiKey /> Raw Encoded JWT Token (Bearer)
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 px-3 py-1 rounded-lg font-semibold transition"
                >
                  {copied ? <><FiCheck className="text-emerald-400" /> Copied!</> : <><FiCopy /> Copy JWT</>}
                </button>
              </div>
              <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-[11px] text-amber-200/90 break-all leading-relaxed max-h-24 overflow-y-auto select-all">
                {currentToken}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>Header Format: <code className="text-amber-300">Authorization: Bearer &lt;TOKEN&gt;</code></span>
                <span>Algorithm: <strong className="text-white">HMAC SHA-256 (HS256)</strong></span>
              </div>
            </div>

            {/* Decoded Claims & Payload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Claims Box */}
              <div className="bg-[#181820] border border-amber-500/20 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <FiLock /> Decoded JWT Claims
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">User ID (sub/id):</span>
                    <span className="font-mono text-amber-200 font-bold truncate max-w-[140px]">{decodedPayload?.id || user?._id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">RBAC Role:</span>
                    <span className="uppercase font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                      {decodedPayload?.role || user?.role || 'customer'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Email Claim:</span>
                    <span className="text-white font-medium truncate max-w-[140px]">{decodedPayload?.email || user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Issued At (iat):</span>
                    <span className="text-gray-300 text-[11px]">{formatTimestamp(decodedPayload?.iat)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Expires At (exp):</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">{formatTimestamp(decodedPayload?.exp)}</span>
                  </div>
                </div>
              </div>

              {/* JSON Visualizer */}
              <div className="bg-[#181820] border border-amber-500/20 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <FiTerminal /> Decoded Payload Object
                </h3>
                <pre className="p-3 bg-black/70 rounded-xl border border-white/5 font-mono text-[10px] text-emerald-300 leading-relaxed overflow-x-auto max-h-40">
                  {JSON.stringify({
                    header: { alg: "HS256", typ: "JWT" },
                    payload: decodedPayload || { id: user?._id, role: user?.role, email: user?.email },
                    signature: "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
                  }, null, 2)}
                </pre>
              </div>

            </div>

            {/* Verification Test Button */}
            <div className="bg-[#14141c] border border-amber-500/30 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FiCheckCircle className="text-amber-400" /> Backend Cryptographic Token Verification Test
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Sends current JWT token in Authorization header to <code>/api/auth/verify-token</code></p>
                </div>
                <button
                  onClick={handleTestVerify}
                  disabled={verifying}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl hover:shadow-lg transition disabled:opacity-50"
                >
                  <FiRefreshCw className={verifying ? 'animate-spin' : ''} />
                  {verifying ? 'Verifying Signature...' : 'Test Verification API'}
                </button>
              </div>

              {verifyResult && (
                <div className={`p-3 rounded-xl border text-xs ${
                  verifyResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  {verifyResult.success ? (
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-1 text-emerald-400">
                        <FiCheckCircle /> Verification Passed: Token Signature & Claims Valid!
                      </div>
                      <pre className="font-mono text-[10px] text-emerald-200/90 pt-1">
                        {JSON.stringify(verifyResult.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p>Verification Error: {verifyResult.error}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-[11px] text-gray-400">
          <span>Security Standard: RFC 7519 JSON Web Token</span>
          <button
            onClick={() => setJwtModalOpen(false)}
            className="text-amber-400 font-bold hover:underline"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
