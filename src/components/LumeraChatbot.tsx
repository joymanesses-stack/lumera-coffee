import React, { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Coffee, MessageCircle, Send, X } from 'lucide-react';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';

type ChatLink = { label: string; to: string };
type ChatMessage = { id: number; sender: 'visitor' | 'assistant'; text: string; links?: ChatLink[] };

const welcome: ChatMessage = {
  id: 1,
  sender: 'assistant',
  text: 'Hello, I’m the Lumera Assistant. I can help you find coffee, learn about our Rwandan origins, or understand how to work with us.',
};

function answerQuestion(question: string): Omit<ChatMessage, 'id' | 'sender'> {
  const text = question.toLowerCase().replace(/[’']/g, '');

  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(text)) {
    return { text: 'Hello! What would you like to know about Lumera Coffee?', links: [{ label: 'Explore our coffee', to: '/coffee' }, { label: 'Contact our team', to: '/contact' }] };
  }

  if (/\b(price|pricing|cost|quote|quotation|buy|purchase|order|sample|minimum order|moq)\b/.test(text)) {
    return { text: 'Pricing and order options depend on the coffee, volume, destination and shipping terms. Send us your requirements and the team can follow up with the right details.', links: [{ label: 'Request a quote', to: '/contact' }, { label: 'How buying works', to: '/buyers' }] };
  }

  if (/\b(export|ship|shipping|shipment|deliver|port|fob|cif|logistics)\b/.test(text)) {
    return { text: 'Lumera works with international coffee buyers and provides export support, including FOB and CIF inquiries. Share your destination and required volume so the team can advise on options.', links: [{ label: 'Export information', to: '/export' }, { label: 'Talk to our team', to: '/contact' }] };
  }

  if (/\b(quality|traceab|moisture|cupping|grade|score|screen|grainpro|certif)\b/.test(text)) {
    return { text: 'Product details depend on the selected coffee batch. Grade, processing, quality assessments and supporting documents are shared when available; scores and certifications are only declared after verification.', links: [{ label: 'Quality approach', to: '/quality' }, { label: 'Coffee specifications', to: '/coffee' }] };
  }

  if (/\b(origin|rwanda|farm|farmer|grow|altitude|highland|terroir)\b/.test(text)) {
    return { text: 'Lumera Coffee is Rwandan Arabica from Karongi and Nyamasheke, Rwanda. Product origin and batch details are available from the team.', links: [{ label: 'Explore our origin', to: '/origin' }, { label: 'About Lumera', to: '/about' }] };
  }

  if (/\b(private label|bulk|wholesale|distributor|roaster|importer|partner|business)\b/.test(text)) {
    return { text: 'Lumera welcomes inquiries from importers, roasters, distributors, retailers, coffee shops, hotels and restaurants. Packaging and private label options can be discussed by agreement.', links: [{ label: 'For buyers', to: '/buyers' }, { label: 'Start an inquiry', to: '/contact' }] };
  }

  if (/\b(coffee|product|bean|arabica|robusta|natural|washed|honey|catalog|catalogue|offer)\b/.test(text)) {
    const examples = COFFEE_PRODUCTS.slice(0, 4).map((product) => product.category).filter((category, index, all) => all.indexOf(category) === index);
    const range = examples.length ? ` The range includes ${examples.join(', ')} coffees.` : '';
    return { text: `Browse the coffee page for the current product descriptions and lot specifications.${range} Availability can change, so contact the team for current offers.`, links: [{ label: 'View our coffee', to: '/coffee' }, { label: 'Request the offer sheet', to: '/contact' }] };
  }

  if (/\b(contact|email|whatsapp|phone|team|person|human|speak)\b/.test(text)) {
    return { text: 'You can send the export team an inquiry or reach them on WhatsApp. Include the coffee you’re interested in, the volume and your destination if you know them.', links: [{ label: 'Contact Lumera', to: '/contact' }, { label: 'WhatsApp export desk', to: 'https://wa.me/250722415434' }] };
  }

  if (/\b(about|lumera|company|story|mission)\b/.test(text)) {
    return { text: 'Lumera Coffee connects Rwandan coffee origins with international buyers, with a focus on careful sourcing, quality and clear trade relationships.', links: [{ label: 'About Lumera', to: '/about' }] };
  }

  return { text: 'I can help with coffee options, Rwanda origins, quality, export and buying inquiries. Try one of those topics, or send your question to the Lumera team.', links: [{ label: 'Explore the website', to: '/coffee' }, { label: 'Contact the team', to: '/contact' }] };
}

const suggestions = ['What coffees do you offer?', 'How do I request a quote?', 'Tell me about your origin'];

export const LumeraChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [nextId, setNextId] = useState(2);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = (value: string) => {
    const question = value.trim();
    if (!question) return;
    const reply = answerQuestion(question);
    setMessages((current) => [
      ...current,
      { id: nextId, sender: 'visitor', text: question },
      { id: nextId + 1, sender: 'assistant', ...reply },
    ]);
    setNextId((current) => current + 2);
    setDraft('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') setIsOpen(false);
  };

  return (
    <div className="lumera-chat">
      {isOpen && (
        <section className="lumera-chat__panel" aria-label="Lumera Assistant chat">
          <header className="lumera-chat__header">
            <div className="lumera-chat__brand-icon"><Coffee size={19} /></div>
            <div><strong>Lumera Assistant</strong><span>Here to help with coffee and trade</span></div>
            <button className="lumera-chat__close" onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={19} /></button>
          </header>
          <div className="lumera-chat__messages" ref={listRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`lumera-chat__message lumera-chat__message--${message.sender}`} key={message.id}>
                {message.sender === 'assistant' && <span className="lumera-chat__avatar"><Bot size={14} /></span>}
                <div className="lumera-chat__bubble">
                  <p>{message.text}</p>
                  {message.links && <div className="lumera-chat__links">{message.links.map((link) => {
                    const className = 'lumera-chat__link';
                    return link.to.startsWith('http') ? <a className={className} href={link.to} key={link.label} target="_blank" rel="noreferrer">{link.label}<ArrowRight size={13} /></a> : <Link className={className} to={link.to} key={link.label} onClick={() => setIsOpen(false)}>{link.label}<ArrowRight size={13} /></Link>;
                  })}</div>}
                </div>
              </div>
            ))}
          </div>
          {messages.length === 1 && <div className="lumera-chat__suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}</div>}
          <form className="lumera-chat__form" onSubmit={handleSubmit}>
            <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleInputKeyDown} placeholder="Ask Lumera a question…" aria-label="Your question" />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message"><Send size={17} /></button>
          </form>
          <p className="lumera-chat__note">Answers are based on information on this website.</p>
        </section>
      )}
      <button className="lumera-chat__launcher" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close Lumera Assistant' : 'Chat with Lumera'} aria-expanded={isOpen}>
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        <span>{isOpen ? 'Close' : 'Ask Lumera'}</span>
      </button>
    </div>
  );
};
