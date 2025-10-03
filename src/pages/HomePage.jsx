import React from 'react';
import { NavLink } from 'react-router-dom';
import homeContent from '../data/home.json';

const HomePage = () => {
  return (
    <div className="page-content futuristic-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">{homeContent.hero.headline}</h1>
          <p className="hero-subheadline">{homeContent.hero.subheadline}</p>
          <NavLink to="/learn" className="hero-cta">{homeContent.hero.cta}</NavLink>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">{homeContent.features.title}</h2>
        <div className="features-grid">
          {homeContent.features.items.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>{homeContent.cta_section.headline}</h2>
        <p>{homeContent.cta_section.subheadline}</p>
        <NavLink to="/login" className="cta-button">{homeContent.cta_section.button_text}</NavLink>
      </section>
    </div>
  );
};

export default HomePage;