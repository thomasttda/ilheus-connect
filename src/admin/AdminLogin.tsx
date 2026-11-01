import { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin = ({ onLoginSuccess, onExit }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      sessionStorage.setItem('ic_admin_auth', 'true');
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Return to website top button */}
      <button
        onClick={onExit}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-2 rounded-full border border-slate-800 backdrop-blur-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Cidade Digital
      </button>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-sky-600 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/60 px-3 py-1 rounded-full">
            Acesso Restrito • Painel de Gestão
          </span>
          <h1 className="text-2xl font-black text-white mt-3">Ilhéus Connect Admin</h1>
          <p className="text-xs text-slate-400 mt-1">
            Controle total de banners, delivery, serviços gerais e notícias.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Usuário ou senha incorretos. Utilize as credenciais padrão.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Usuário Administrador
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            Entrar no Painel Seguro
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Acesso administrativo protegido • Ilhéus Connect
          </p>
        </div>
      </div>
    </div>
  );
};
