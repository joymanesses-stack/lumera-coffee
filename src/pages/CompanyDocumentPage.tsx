import React, { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';

const ACCESS_CODE = 'Lumera2020';
const DOCUMENT_IMAGE = 'https://i.postimg.cc/CKF5mVNz/lumera-verification.png';

export const CompanyDocumentPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => event.preventDefault();
    const blockCopyAndPrint = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && ['c', 's', 'p', 'u'].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockCopyAndPrint);
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockCopyAndPrint);
    };
  }, []);

  const unlockDocument = (event: FormEvent) => {
    event.preventDefault();
    if (code === ACCESS_CODE) {
      setUnlocked(true);
      setError('');
      return;
    }
    setError('That access code is not correct. Please try again.');
  };

  return (
    <main className="min-h-screen bg-[#101310] pt-32 pb-16 px-4 select-none" onCopy={(event) => event.preventDefault()}>
      {!unlocked ? (
        <section className="mx-auto mt-12 max-w-md rounded-2xl border border-[#B86F3F]/50 bg-[#173B2B] p-7 sm:p-9 shadow-2xl">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full border border-[#E7A56F]/40 bg-black/20 text-[#E7A56F]">
            <LockKeyhole size={21} />
          </div>
          <h1 className="text-center text-2xl font-bold text-white">Company document</h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-[#E5E6DD]">Enter the access code to view this private document.</p>
          <form onSubmit={unlockDocument} className="mt-6 space-y-4">
            <label htmlFor="document-access-code" className="block text-xs font-semibold uppercase tracking-wider text-[#E7C48C]">Access code</label>
            <input
              id="document-access-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[#0B0D0C] px-4 py-3 text-sm text-white outline-none focus:border-[#E7A56F]"
              required
            />
            {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-[#B86F3F] px-5 py-3 text-sm font-bold text-white hover:bg-[#C6814E]">View document</button>
          </form>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="mb-5 text-lg font-semibold text-white">Lumera Company Ltd</h1>
          <img
            src={DOCUMENT_IMAGE}
            alt="Lumera Company Ltd document"
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className="mx-auto h-auto max-h-[78vh] w-auto max-w-full object-contain pointer-events-none"
          />
          <p className="mt-4 text-xs text-[#A8A498]">Private company document</p>
        </section>
      )}
    </main>
  );
};
