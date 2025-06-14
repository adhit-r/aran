import React from 'react';
import Layout from '@theme/Layout';
import styles from './product.module.css'; // Reusing the same CSS module

// Define an interface for feature details for clarity
interface FeatureDetail {
  id: string; // For anchor links
  title: string;
  description: string[]; // Array of paragraphs
  benefits?: string[];
}

const features: FeatureDetail[] = [
  {
    id: 'api-catalog',
    title: 'Centralized API Catalog',
    description: [
      'Aran API Sentinel provides a comprehensive, auto-updating API catalog that serves as the single source of truth for all your APIs.',
      'It automatically discovers and documents API endpoints, specifications (like OpenAPI), request/response schemas, and associated metadata. This ensures that developers, security teams, and architects have a clear and consistent view of the entire API landscape.',
    ],
    benefits: [
      'Eliminate shadow and zombie APIs by bringing everything into a managed inventory.',
      'Improve developer productivity with easy access to API documentation.',
      'Enhance security posture by understanding your attack surface.',
      'Facilitate API governance and version control.',
    ],
  },
  {
    id: 'api-discovery',
    title: 'AI-Powered API Discovery',
    description: [
      'Leveraging advanced AI and machine learning techniques, Aran API Sentinel continuously monitors your network traffic and code repositories to discover new and undocumented APIs.',
      'This includes internal, external, and third-party APIs, ensuring that no API goes unnoticed. The discovery process is non-intrusive and provides insights into API usage patterns and data flows.',
    ],
    benefits: [
      'Gain complete visibility into your API ecosystem.',
      'Identify and manage risks associated with unmanaged APIs.',
      'Ensure compliance with data governance policies.',
      'Understand API dependencies and potential impact of changes.',
    ],
  },
  {
    id: 'api-threats',
    title: 'AI-Powered Threat Detection (API Threats)',
    description: [
      'Our AI-driven threat detection engine analyzes API traffic in real-time to identify and alert on malicious activities, anomalous behavior, and potential security breaches.',
      'It detects common API attacks (like OWASP API Top 10), as well as sophisticated, context-aware threats. Customizable alerting and integration with SIEM/SOAR systems ensure prompt incident response.',
    ],
    benefits: [
      'Proactively protect against API attacks and data breaches.',
      'Reduce false positives with context-aware threat analysis.',
      'Accelerate incident response with actionable alerts.',
      'Continuously adapt to evolving threat landscapes.',
    ],
  },
  {
    id: 'mcp-catalog',
    title: 'Mission Critical Process (MCP) Catalog',
    description: [
      'Aran API Sentinel allows you to define and catalog your Mission Critical Processes (MCPs) and map the APIs that support them.',
      'This provides a business-centric view of your API security, highlighting the APIs that are most critical to your organization\'s operations and revenue streams.',
    ],
    benefits: [
      'Prioritize security efforts based on business impact.',
      'Understand the blast radius of API vulnerabilities on critical processes.',
      'Improve communication between business and technical teams regarding API risks.',
    ],
  },
  {
    id: 'security-policies',
    title: 'Robust Security Policies',
    description: [
      'Define, manage, and enforce granular security policies across your entire API landscape. Aran API Sentinel allows you to create custom policies or use pre-built templates based on industry best practices and regulatory requirements.',
      'Policies can cover authentication, authorization, data encryption, rate limiting, and more. The platform continuously monitors for policy violations and can automate enforcement actions.',
    ],
    benefits: [
      'Ensure consistent security posture across all APIs.',
      'Automate compliance with internal and external regulations.',
      'Reduce manual effort in security configuration and auditing.',
      'Adapt policies quickly to changing business needs or threats.',
    ],
  },
  {
    id: 'access-control',
    title: 'Comprehensive Access Control',
    description: [
      'Implement fine-grained access control for your APIs and the Aran API Sentinel platform itself. Integrate with existing Identity Providers (IdPs) and manage roles and permissions centrally.',
      'This ensures that only authorized users and services can access sensitive API functionalities and data.',
    ],
    benefits: [
      'Prevent unauthorized access to APIs and data.',
      'Enforce the principle of least privilege.',
      'Simplify user and permission management.',
      'Maintain audit trails for access and administrative actions.',
    ],
  },
];

function ProductFeaturesPage() {
  return (
    <Layout
      title="Features"
      description="Explore the powerful features of Aran API Sentinel for API security and governance."
    >
      <div className={`container ${styles.featurePageContainer} margin-vert--lg`}>
        <header className="text--center margin-bottom--xl">
          <h1 className={styles.heroTitle}>Features of Aran API Sentinel</h1>
          <p className={styles.heroSubtitle}>
            A deep dive into the capabilities that make Aran API Sentinel a leader in API protection.
          </p>
        </header>

        {features.map((feature) => (
          <section key={feature.id} id={feature.id} className={styles.featureDetailSection}>
            <h2>{feature.title}</h2>
            {feature.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {feature.benefits && feature.benefits.length > 0 && (
              <>
                <h3>Key Benefits:</h3>
                <ul>
                  {feature.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ))}
      </div>
    </Layout>
  );
}

export default ProductFeaturesPage;
