import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBarber } from '../contexts/BarberContext';
import { FaSpinner } from 'react-icons/fa';

const BarberRedirectHandler = () => {
  const { slug } = useParams();
  const { loadBarberBySlug } = useBarber();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await loadBarberBySlug(slug);
        navigate('/');
      } catch (err) {
        console.error('Barber redirect handler error:', err);
        setError('Sartarosh topilmadi yoki faol emas. Iltimos, havolani tekshirib ko\'ring.');
        setTimeout(() => {
          navigate('/');
        }, 4000);
      }
    };

    if (slug) {
      handleRedirect();
    }
  }, [slug, loadBarberBySlug, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="relative p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl shadow-2xl max-w-md w-full text-center space-y-6">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-md -z-10 animate-pulse"></div>

        {!error ? (
          <>
            <div className="relative w-16 h-16 flex items-center justify-center mx-auto">
              <FaSpinner size={32} className="text-emerald-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 border-t-emerald-500 animate-ping"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wide text-white">Sartaroshxonaga ulanish</h2>
              <p className="text-sm text-zinc-400">
                Sartarosh profili va xizmatlari yuklanmoqda. Iltimos, kuting...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-500 text-3xl">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wide text-white">Xatolik yuz berdi</h2>
              <p className="text-sm text-red-400 font-medium">
                {error}
              </p>
              <p className="text-xs text-zinc-500 pt-2">
                Bosh sahifaga yo'naltirilmoqda...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarberRedirectHandler;
