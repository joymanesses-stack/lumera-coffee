import React, { useState } from 'react';
import { CheckCircle2, Clock3, Eye, Trash2, X } from 'lucide-react';

export type AgentInquiry = { id: string; contactName?: string; companyName?: string; email?: string; phone?: string; coffeeType?: string; quantityRequired?: string; message?: string; status?: string; createdAt?: string };
export type AgentCall = { id: string; callerUid?: string; caller?: { name?: string; email?: string; phone?: string }; mode?: string; status?: string; createdAt?: string; acceptedAt?: string; missedAt?: string; endedAt?: string };
export type AgentCustomer = { uid: string; email?: string; displayName?: string; active?: boolean };
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString() : 'Not recorded';

export function AgentRecordsPanel({ calls, inquiries, customers, onUpdateInquiry, onDeleteInquiry, onDeleteCustomer }: {
  calls: AgentCall[]; inquiries: AgentInquiry[]; customers: AgentCustomer[];
  onUpdateInquiry: (id: string, status: string) => void;
  onDeleteInquiry: (id: string) => void;
  onDeleteCustomer: (uid: string) => void;
}) {
  const [selectedCall, setSelectedCall] = useState<AgentCall | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<AgentInquiry | null>(null);
  return <>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412] p-5">
        <h2 className="mb-4 text-xl font-bold text-white">Call history ({calls.length})</h2>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-2">
        {calls.map((call) => <article key={call.id} className="flex items-center justify-between gap-3 rounded border border-[#303831] bg-[#0B0D0C] p-4">
          <div className="min-w-0"><b className="block truncate">{call.caller?.name || call.caller?.email || 'Customer'}</b><span className="text-xs text-[#A8A498]">{call.mode || 'voice'} · {call.status || 'ended'} · {dateLabel(call.createdAt)}</span></div>
          <button onClick={() => setSelectedCall(call)} className="inline-flex shrink-0 items-center gap-1 rounded border border-[#3A493D] px-3 py-2 text-xs text-[#C5A059]"><Eye className="h-3 w-3"/>View</button>
        </article>)}
        {!calls.length && <p className="text-sm text-[#858177]">No completed or missed calls.</p>}
        </div>
      </section>
      <section className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-[#252D27] bg-[#111412] p-5">
        <h2 className="mb-4 text-xl font-bold text-white">Customer inquiries ({inquiries.length})</h2>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-2">
        {inquiries.map((item) => <article key={item.id} className="flex items-center justify-between gap-3 rounded border border-[#303831] bg-[#0B0D0C] p-4">
          <div className="min-w-0"><b className="block truncate">{item.contactName || 'Customer inquiry'}</b><span className="text-xs text-[#A8A498]">{item.email || 'No email'} · {dateLabel(item.createdAt)}</span><span className="block text-xs text-[#C5A059]">Status: {item.status || 'new'}</span></div>
          <button onClick={() => setSelectedInquiry(item)} className="inline-flex shrink-0 items-center gap-1 rounded border border-[#3A493D] px-3 py-2 text-xs text-[#C5A059]"><Eye className="h-3 w-3"/>View</button>
        </article>)}
        {!inquiries.length && <p className="text-sm text-[#858177]">No inquiries received yet.</p>}
        </div>
      </section>
    </div>
    <section className="mt-6 rounded-2xl border border-[#252D27] bg-[#111412] p-5">
      <h2 className="mb-4 text-xl font-bold text-white">Customer accounts ({customers.length})</h2>
      <p className="mb-4 text-xs text-[#A8A498]">Disabling an account prevents sign-in. Records remain available for audit.</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{customers.map((customer) => <article key={customer.uid} className="flex min-w-0 items-center justify-between gap-2 rounded border border-[#303831] bg-[#0B0D0C] p-3"><div className="min-w-0"><b className="block truncate text-sm">{customer.displayName || 'Customer'}</b><span className="block truncate text-xs text-[#A8A498]">{customer.email || customer.uid}</span></div><button title="Disable customer account" onClick={() => onDeleteCustomer(customer.uid)} className="rounded border border-red-900 p-2 text-red-300"><Trash2 className="h-4 w-4"/></button></article>)}</div>
      {!customers.length && <p className="text-sm text-[#858177]">No customer accounts found.</p>}
    </section>
    {(selectedCall || selectedInquiry) && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedCall(null); setSelectedInquiry(null); } }}><div className="w-full max-w-xl rounded-2xl border border-[#39463C] bg-[#111412] p-6 text-[#DEDBD2]">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-white">{selectedCall ? 'Call details' : 'Inquiry details'}</h2><button aria-label="Close details" onClick={() => { setSelectedCall(null); setSelectedInquiry(null); }}><X className="h-5 w-5"/></button></div>
      {selectedCall && <div className="space-y-3 text-sm"><p><b>Caller:</b> {selectedCall.caller?.name || 'Customer'}</p><p><b>Email:</b> {selectedCall.caller?.email || 'Not provided'}</p><p><b>Phone:</b> {selectedCall.caller?.phone || 'Not provided'}</p><p><b>Call type/status:</b> {selectedCall.mode || 'voice'} / {selectedCall.status || 'ended'}</p><p><b>Started:</b> {dateLabel(selectedCall.createdAt)}</p><p><b>Accepted:</b> {dateLabel(selectedCall.acceptedAt)}</p><p><b>Missed:</b> {dateLabel(selectedCall.missedAt)}</p><p><b>Ended:</b> {dateLabel(selectedCall.endedAt)}</p><p className="break-all"><b>Customer ID:</b> {selectedCall.callerUid || 'Not recorded'}</p></div>}
      {selectedInquiry && <div className="space-y-3 text-sm"><p><b>Contact:</b> {selectedInquiry.contactName || 'Not provided'}</p><p><b>Company:</b> {selectedInquiry.companyName || 'Not provided'}</p><p><b>Email:</b> {selectedInquiry.email || 'Not provided'}</p><p><b>Phone:</b> {selectedInquiry.phone || 'Not provided'}</p><p><b>Coffee:</b> {selectedInquiry.coffeeType || 'Not provided'}</p><p><b>Quantity:</b> {selectedInquiry.quantityRequired || 'Not provided'}</p><p><b>Received:</b> {dateLabel(selectedInquiry.createdAt)}</p><p><b>Status:</b> {selectedInquiry.status || 'new'}</p><div><b>Message:</b><p className="mt-1 whitespace-pre-wrap rounded bg-[#0B0D0C] p-3">{selectedInquiry.message || 'No message'}</p></div><div className="flex flex-wrap gap-2 pt-2">{selectedInquiry.status !== 'contacted' && <button onClick={() => { onUpdateInquiry(selectedInquiry.id, 'contacted'); setSelectedInquiry(null); }} className="inline-flex items-center gap-1 rounded bg-emerald-900 px-3 py-2 text-xs"><CheckCircle2 className="h-3 w-3"/>Mark contacted</button>}<button onClick={() => { onDeleteInquiry(selectedInquiry.id); setSelectedInquiry(null); }} className="inline-flex items-center gap-1 rounded border border-red-900 px-3 py-2 text-xs text-red-300"><Trash2 className="h-3 w-3"/>Delete inquiry</button></div></div>}
    </div></div>}
  </>;
}
