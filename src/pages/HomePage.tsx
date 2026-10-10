import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { COFFEE_PRODUCTS } from '../data/coffeeProducts';
import { CoffeeProduct } from '../types';

interface HomePageProps {
  onOpenQuoteModal: (coffeeName?: string) => void;
  onOpenCatalogModal: () => void;
  onSelectProductForSpec: (product: CoffeeProduct) => void;
}

const commitments = [
  { title: 'Rwandan Arabica', copy: 'Coffee from Karongi and Nyamasheke.' },
  { title: 'Green and roasted', copy: 'Unroasted beans, whole roasted beans and ground coffee.' },
  { title: 'Details by batch', copy: 'Processing and specifications shared when available.' },
  { title: 'Clear trade terms', copy: 'Pricing, packaging and delivery confirmed for each order.' },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal, onOpenCatalogModal, onSelectProductForSpec }) => {
  const featured = COFFEE_PRODUCTS.slice(0, 3);

  return (
    <div className="lumera-home">
      <section className="home-hero" id="home">
        <div className="home-hero__image" aria-hidden="true" />
        <div className="home-hero__shade" aria-hidden="true" />
        <div className="home-shell home-hero__content">
          <span className="home-eyebrow">Coffee, grown in Rwanda</span>
          <h1>Lumera<br /><span>Coffee</span></h1>
          <p className="home-hero__lead">Exceptional Rwandan coffee.<br className="hidden sm:block" /> Connected to the world.</p>
          <p className="home-hero__copy">Rwandan Arabica from Karongi and Nyamasheke, offered as green coffee and roasted coffee for business buyers.</p>
          <div className="home-actions">
            <Link to="/coffee" className="home-button">Discover our coffee <ArrowRight size={15} /></Link>
            <button className="home-button home-button--outline" onClick={() => onOpenQuoteModal()}>Partner with us <ArrowRight size={15} /></button>
          </div>
        </div>
        <span className="home-hero__origin">Rwanda<br /><small>Premium Arabica</small></span>
      </section>

      <section className="home-story" id="about">
        <div className="home-shell home-story__layout">
        <div className="home-story__copy">
          <span className="home-kicker">A little about us</span>
          <h2>Rooted in Rwanda.<br />Made to be shared.</h2>
          <p>Lumera means “light and shine.” It speaks to what we hope to bring to Rwandan coffee: care for its origins, respect for the people who grow it, and a place for it on tables around the world.</p>
          <Link to="/about" className="home-text-link">Get to know Lumera <ArrowRight size={15} /></Link>
        </div>
        <figure className="home-story__figure">
          <img className="home-story__image" src="/images/lumera/espresso-machine.jpeg" alt="Espresso flowing from a machine into a cup" loading="lazy" />
          <figcaption><span>01</span> A good cup carries a sense of place.</figcaption>
        </figure>
        </div>
      </section>

      <section className="home-coffee" id="coffee">
        <div className="home-shell">
          <div className="home-section-heading">
            <div><span className="home-kicker">From our coffee range</span><h2>Find the right coffee<br />for your market.</h2></div>
            <Link to="/coffee" className="home-light-link">Explore the full range <ArrowRight size={15} /></Link>
          </div>
          <div className="home-products">
            {featured.map((coffee, index) => (
              <article className="home-product" key={coffee.id}>
                <button className="home-product__image" onClick={() => onSelectProductForSpec(coffee)} aria-label={`View ${coffee.name} details`}>
                  <img src={coffee.imageUrl} alt={coffee.name} loading="lazy" />
                  <span className="home-product__index">0{index + 1}</span>
                </button>
                <div className="home-product__info"><div><h3>{coffee.category}</h3><p>{coffee.format}</p></div><button onClick={() => onSelectProductForSpec(coffee)} aria-label={`View ${coffee.name}`}><ArrowRight size={16} /></button></div>
              </article>
            ))}
          </div>
          <div className="home-private"><div><span className="home-private__label">For coffee businesses</span><h3>Looking for a coffee format for your market?</h3></div><p>Ask about current availability, packaging and bulk order options.</p><button className="home-text-link" onClick={onOpenCatalogModal}>Talk to us about options <ArrowRight size={15} /></button></div>
        </div>
      </section>

      <section className="home-values" id="quality">
        <div className="home-shell home-values__layout">
          <div className="home-values__intro"><span className="home-kicker">What guides our work</span><h2>Good coffee is<br />a shared effort.</h2><p>From the first conversation at origin to the final preparation for export, we want every step to reflect care and respect.</p><Link to="/quality" className="home-text-link">How we work <ArrowRight size={15} /></Link></div>
          <div className="home-commitments__grid">{commitments.map(({ title, copy }, index) => <div className="home-commitment" key={title}><span className="home-commitment__number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
        </div>
      </section>

      <section className="home-origin" id="origin">
        <div className="home-shell home-origin__layout">
          <figure className="home-origin__figure"><img className="home-origin__image" src="/images/lumera/rwanda-highlands.jpeg" alt="Coffee farms across Rwanda’s green highlands" loading="lazy" /><figcaption><MapPin size={14} /> Rwanda, East Africa</figcaption></figure>
          <div className="home-origin__copy"><span className="home-kicker">Where it begins</span><h2>From Rwanda’s<br />coffee-growing regions.</h2><p>Lumera’s coffee comes from Karongi and Nyamasheke. Origin, processing and grade details are shared for the available coffee batch.</p><Link to="/origin" className="home-button">Explore our origins <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="home-impact">
        <div className="home-shell home-impact__layout">
          <figure className="home-impact__figure"><img src="/images/lumera/shared-harvest.jpeg" alt="Coffee farmers sharing freshly picked cherries" loading="lazy" /><figcaption>Working together, from origin onward.</figcaption></figure>
          <div className="home-impact__copy"><span className="home-kicker">For our partners</span><h2>A closer link<br />to coffee’s origin.</h2><p>Every buyer has different needs. We help you explore available Rwandan coffees, understand each lot, and plan the next steps toward export.</p><div className="home-trust__points"><span><ShieldCheck size={16} /> Clear lot information</span><span><MapPin size={16} /> Coffee from Rwanda</span><span><Truck size={16} /> Export coordination</span></div><button className="home-button home-button--outline" onClick={() => onOpenQuoteModal()}>Talk with our team <ArrowRight size={15} /></button></div>
        </div>
      </section>

      <section className="home-partner"><div className="home-shell home-partner__layout"><div><span className="home-kicker">Let’s work together</span><h2>Bring Rwandan coffee<br />to your market.</h2></div><div className="home-partner__action"><p>Tell us what you’re looking for. We’ll help you explore the coffees, sourcing options and next steps that fit your business.</p><div className="home-actions"><button className="home-button" onClick={() => onOpenQuoteModal()}>Partner with us <ArrowRight size={15} /></button><button className="home-button home-button--outline" onClick={onOpenCatalogModal}>Request our offer sheet <ArrowRight size={15} /></button></div></div></div></section>
    </div>
  );
};
