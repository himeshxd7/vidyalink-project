import React from 'react';
import aboutContent from '../data/about.json';

const AboutPage = () => {
  return (
    <div className="page-content futuristic-about">
      <header className="about-header">
        <h1>{aboutContent.header.title}</h1>
        <p className="subtitle">{aboutContent.header.subtitle}</p>
      </header>

      <section className="about-mission">
        <h2>{aboutContent.mission.title}</h2>
        <p>{aboutContent.mission.content}</p>
      </section>

      <section className="about-features">
        <h2>{aboutContent.features_section.title}</h2>
        <div className="features-list">
          {aboutContent.features_section.features.map(feature => (
            <div key={feature.name} className="feature-item">
              <h3>{feature.name}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="about-roles">
        <h2>{aboutContent.roles.title}</h2>
        <div className="roles-container">
            <div className="role-card">
                <h3>Students</h3>
                <p>{aboutContent.roles.student_role}</p>
            </div>
            <div className="role-card">
                <h3>Faculty</h3>
                <p>{aboutContent.roles.faculty_role}</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;