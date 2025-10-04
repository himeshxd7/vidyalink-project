import React from 'react';
import { NavLink } from 'react-router-dom';

// Data is now included directly in the component to resolve the import error.
const homeContent = {
  "hero": {
    "headline": "Unlock Your Campus Potential.",
    "subheadline": "VidyaLink is our exclusive peer-to-peer learning network. Find skilled student tutors for any subject, or share your own knowledge and build your profile.",
    "cta": "Explore Courses"
  },
  "features": {
    "title": "A Smarter Way to Learn",
    "items": [
      {
        "id": 1,
        "icon": "fa-search",
        "title": "Discover Skills",
        "description": "Search for any skill, from complex academic subjects to creative hobbies, and find peers ready to help."
      },
      {
        "id": 2,
        "icon": "fa-graduation-cap",
        "title": "Become a Tutor",
        "description": "Showcase your expertise. Publish courses, set your own price, and start sharing your knowledge with the campus community."
      },
      {
        "id": 3,
        "icon": "fa-check-circle",
        "title": "Faculty Endorsed",
        "description": "Look for courses endorsed by our faculty for a stamp of approval on quality and credibility."
      }
    ]
  },
  "cta_section": {
    "headline": "Ready to Start Your Learning Journey?",
    "subheadline": "Join the community today and transform the way you learn and grow on campus.",
    "button_text": "Get Started Now"
  }
};

const HomePage = () => {
  return (
    <div className="page-content futuristic-home">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">{homeContent.hero.headline}</h1>
          <p className="hero-subheadline">{homeContent.hero.subheadline}</p>
          <NavLink to="/learn" className="btn btn-primary hero-cta">{homeContent.hero.cta}</NavLink>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">{homeContent.features.title}</h2>
        <div className="features-grid">
          {homeContent.features.items.map((feature) => (
            <div key={feature.id} className="glass-card feature-card">
              <div className="feature-icon">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section glass-card">
        <h2 className="section-title">{homeContent.cta_section.headline}</h2>
        <p className="hero-subheadline">{homeContent.cta_section.subheadline}</p>
        <NavLink to="/login" className="btn btn-primary cta-button">{homeContent.cta_section.button_text}</NavLink>
      </section>
    </div>
  );
};

export default HomePage;

