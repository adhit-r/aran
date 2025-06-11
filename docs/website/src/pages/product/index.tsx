import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './product.module.css'; // We'll create this for custom styles

// Import Lucide icons
import { ShieldCheck, Search, ListChecks, AlertTriangle, Network, Users } from 'lucide-react';

function ProductHomepage() {
  return (
    <Layout
      title="Product Home"
      description="Discover Aran API Sentinel: Comprehensive API Security and Governance."
    >
      {/* Hero Section */}
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Aran API Sentinel: Comprehensive API Security and Governance
          </h1>
          <p className={styles.heroSubtitle}>
            Discover, manage, and secure your APIs with AI-powered insights.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/product/features"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </header>

      {/* Key Features Overview Section */}
      <main>
        <section className={styles.featuresSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12">
                <h2 className={styles.sectionTitle}>Key Capabilities</h2>
              </div>
            </div>
            <div className={styles.featuresGrid}> {/* Using custom class for grid */}
              <FeatureCard
                icon={<Search size={48} />}
                title="AI-Powered Discovery"
                description="Automatically discover all your APIs, including shadow and zombie APIs, providing a complete inventory."
                linkTo="/product/features#api-discovery"
              />
              <FeatureCard
                icon={<ListChecks size={48} />}
                title="Centralized API Catalog"
                description="Maintain a comprehensive, up-to-date catalog of all your APIs with detailed metadata and documentation."
                linkTo="/product/features#api-catalog"
              />
              <FeatureCard
                icon={<AlertTriangle size={48} />}
                title="Proactive Threat Detection"
                description="Leverage AI to identify and alert on anomalous behavior and potential threats to your APIs in real-time."
                linkTo="/product/features#api-threats"
              />
              <FeatureCard
                icon={<ShieldCheck size={48} />}
                title="Robust Security Policies"
                description="Define, enforce, and monitor security policies across your entire API landscape consistently."
                linkTo="/product/features#security-policies"
              />
            </div>
          </div>
        </section>

        {/* Secondary CTA or Value Proposition Section */}
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
              {/* Optional: Add a contact or demo link here */}
              {/* <Link
                className="button button--outline-primary button--lg"
                to="/contact-us" // Example link
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
  linkTo: string;
}

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
