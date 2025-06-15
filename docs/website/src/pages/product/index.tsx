import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './product.module.css';

// Import Lucide icons
import {
    ShieldCheck,
    Search,
    ListChecks,
    AlertTriangle,
    Network, // Used for MCP Catalog / Governance
    Users,   // Used for Access Control
    Cpu,     // Alternative for MCP/Governance or tech-related
    LayoutGrid, // For Unified Platform
    BrainCircuit, // For AI-Powered Intelligence
    ShieldAlert, // For Proactive Security
    Handshake // For Collaboration
} from 'lucide-react';

function ProductHomepage() {
  return (
    <Layout
      title="Product Home - Aran API Sentinel" // Enhanced title
      description="Gain complete visibility and proactive control over your entire API ecosystem with Aran API Sentinel's AI-driven security, governance, and management platform." // Enhanced description
    >
      {/* Hero Section */}
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Aran API Sentinel: Comprehensive API Security and Governance
          </h1>
          <p className={styles.heroSubtitle}>
            Gain complete visibility and proactive control over your entire API ecosystem with our AI-driven security, governance, and management platform.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/product/features"
            >
              Explore Features
            </Link>
            {/* Optional secondary button from prompt, kept for now */}
            {/* <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
            >
              Learn More
            </Link> */}
          </div>
        </div>
      </header>

      <main>
        {/* Core Pillars Section (Expanded Key Capabilities) */}
        <section className={styles.featuresSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.sectionTitle}>Core Pillars of Aran API Sentinel</h2>
              </div>
            </div>
            <div className={styles.featuresGrid}> {/* Ensure this grid can handle 2 or 3 items per row gracefully */}
              <FeatureCard
                icon={<Search size={40} />} // Slightly smaller icons for cards
                title="AI-Powered Discovery"
                description="Automatically discover all your APIs—internal, external, shadow, and zombie—providing a complete, real-time inventory."
                linkTo="/product/features#api-discovery"
              />
              <FeatureCard
                icon={<ListChecks size={40} />}
                title="Centralized API Catalog"
                description="Maintain a comprehensive, up-to-date catalog of all APIs with detailed metadata, specifications, and documentation links."
                linkTo="/product/features#api-catalog"
              />
              <FeatureCard
                icon={<AlertTriangle size={40} />}
                title="AI-Driven Threat Detection"
                description="Leverage AI to identify and alert on anomalous behavior, known attack patterns, and potential threats to your APIs in real-time."
                linkTo="/product/features#api-threats"
              />
              <FeatureCard
                icon={<ShieldCheck size={40} />}
                title="Robust Security Policies"
                description="Define, enforce, and monitor security policies consistently across your entire API landscape to ensure compliance and reduce risk."
                linkTo="/product/features#security-policies"
              />
              <FeatureCard
                icon={<Users size={40} />}
                title="Comprehensive Access Control"
                description="Implement fine-grained access control for your APIs and the platform itself, integrating with existing identity solutions."
                linkTo="/product/features#access-control"
              />
              <FeatureCard
                icon={<Network size={40} />} // Using Network icon for MCP
                title="MCP Catalog & Governance"
                description="Catalog Mission Critical Processes (MCPs), map their API dependencies, and apply targeted governance and security monitoring."
                linkTo="/product/features#mcp-catalog" // Assuming an anchor for MCP Catalog
              />
            </div>
          </div>
        </section>

        {/* Why Choose Aran API Sentinel? Section */}
        <section className={styles.whyAranSection}> {/* Potentially new style or reuse featuresSection style */}
          <div className="container">
            <h2 className={styles.sectionTitle}>Why Choose Aran API Sentinel?</h2>
            <div className={styles.featuresGrid}> {/* Reusing featuresGrid for similar layout, or create a new one e.g., whyAranGrid */}
              <FeatureCard
                icon={<LayoutGrid size={40} />}
                title="Unified API Lifecycle Management"
                description="From discovery and cataloging to security policy enforcement and real-time threat detection, Aran provides a single, integrated platform for your entire API lifecycle."
                linkTo="/docs/intro" // Link to relevant doc page or feature page
              />
              <FeatureCard
                icon={<BrainCircuit size={40} />}
                title="AI-Powered Intelligence"
                description="Leverage cutting-edge AI to automate complex tasks like API discovery, anomaly detection, and risk assessment, freeing up your security teams for strategic work."
                linkTo="/product/features#api-discovery" // Example link
              />
              <FeatureCard
                icon={<ShieldAlert size={40} />}
                title="Proactive & Adaptive Security"
                description="Shift from reactive incident response to a proactive security posture with continuous monitoring and adaptive controls that evolve with your API landscape."
                linkTo="/product/features#api-threats" // Example link
              />
               <FeatureCard
                icon={<Handshake size={40} />}
                title="Enhanced Collaboration"
                description="Foster better collaboration between development, operations, and security teams with a shared understanding and centralized control of your APIs."
                linkTo="/docs/intro" // Example link
              />
            </div>
          </div>
        </section>

        {/* Secondary CTA or Value Proposition Section (existing) */}
        <section className={styles.secondaryCtaSection}>
          <div className="container text--center">
            <h2 className={styles.sectionTitle}>Ready to Secure Your APIs?</h2>
            <p className="margin-bottom--lg">
              Dive deeper into how Aran API Sentinel can transform your API security posture.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg margin-right--md"
                to="/docs/intro"
              >
                Read the Docs
              </Link>
              {/* <Link
                className="button button--outline-primary button--lg"
                to="/contact-us"
              >
                Request a Demo
              </Link> */}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string; // Added linkTo prop for "Why Aran" cards too
}

// FeatureCard component remains the same as it's flexible enough
function FeatureCard({ icon, title, description, linkTo }: FeatureCardProps) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="button button--outline button--sm" to={linkTo}>
        Learn More
      </Link>
    </div>
  );
}

export default ProductHomepage;
