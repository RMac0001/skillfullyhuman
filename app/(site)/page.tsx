'use client';
import { Hero } from '@components/ui/Hero';
import { Content } from '@components/layout/Content';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Welcome to Skillfully Human"
        description="Learn fast. Think deep. Stay real."
        imageSrc="/hero-home.png"
        height={300}
        position="center"
      />
      <Content>
        {/* Content Section */}
        <div className="container">
          <p>
            <strong>Skillfully Human</strong> is your home for creative
            training, digital independence, and guided transformation. We blend
            AI tools with human insight to help you write better, earn smarter,
            and grow stronger.
          </p>
        </div>

        <div className="container grid">
          <div className="pillar-card">
            <h2>Writing Trainer</h2>
            <p>Daily prompts, perfect paragraphs, and AI-powered critiques.</p>
            <a href="/writing-trainer" className="btn small">
              Learn More
            </a>
          </div>
          <div className="pillar-card">
            <h2>Coaching & Therapy</h2>
            <p>
              Self-discovery meets digital reflection. Guided by decades of
              experience.
            </p>
            <a href="/coaching" className="btn small">
              Meet Your Coach
            </a>
          </div>
          <div className="pillar-card">
            <h2>Opportunity Harvester</h2>
            <p>
              Find, filter, and act on real income opportunities—no fluff, just
              possibilities.
            </p>
            <a href="/opportunity" className="btn small">
              Start Harvesting
            </a>
          </div>
          <div className="pillar-card">
            <h2>Tech for Humans</h2>
            <p>
              Use AI and automation without losing your soul. Tools that make
              life easier.
            </p>
            <a href="/tech" className="btn small">
              Explore Tools
            </a>
          </div>
        </div>

        <div className="container">
          <h2>Why It Works</h2>
          <ul>
            <li>✓ Human-first design principles</li>
            <li>✓ Practical skills, not just theory</li>
            <li>✓ Built with love, powered by GPT</li>
          </ul>
        </div>
      </Content>
    </>
  );
}
