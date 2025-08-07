import React from 'react';
import Layout from '@theme/Layout';
import styles from './product.module.css'; // Reusing the same CSS module
import {
    ListChecks,
    Search,
    AlertTriangle,
    ShieldCheck,
    Users,
    Network, // Or Cpu
    type LucideIcon
} from 'lucide-react';

// Define an interface for feature details for clarity
interface FeatureDetail {
  id: string; // For anchor links
  title: string;
  icon: LucideIcon; // Added icon
  description: string[]; // Array of paragraphs
  benefits?: string[];
  howItWorks?: {
    title?: string;
    steps: string[];
  };
}

const features: FeatureDetail[] = [
  {
    id: 'api-catalog',
    title: 'Centralized API Catalog',
    icon: ListChecks,
    description: [
      'Aran API Sentinel provides a comprehensive, auto-updating API catalog that serves as the single source of truth for all your APIs, whether discovered automatically or registered manually.',
      'It meticulously documents API endpoints, specifications (like OpenAPI v2/v3, AsyncAPI), request/response schemas, and associated metadata including versioning, ownership, and lifecycle status. This ensures that developers, security teams, and architects have a clear, consistent, and always up-to-date view of the entire API landscape.',
    ],
    benefits: [
      'Eliminate shadow, zombie, and unmanaged APIs by bringing every service into a managed inventory.',
      'Improve developer productivity with easy access to accurate API documentation and specifications.',
      'Enhance security posture by providing a comprehensive understanding of your potential attack surface.',
      'Facilitate API governance and version control with clear ownership, lifecycle status, and dependency mapping.',
      'Reduce integration complexities and time-to-market for new API-driven products.',
    ],
    // {/* TODO: Link to detailed doc page or demo */}
  },
  {
    id: 'api-discovery',
    title: 'API Discovery',
    icon: Search,
    description: [
      'Leveraging pattern matching and rule-based analysis, Aran API Sentinel continuously monitors your network traffic (e.g., VPC flow logs, API gateway logs) and can analyze code repositories to discover new, undocumented, or deprecated APIs.',
      'This includes internal, external, and third-party APIs, ensuring that no API goes unnoticed. The discovery process is non-intrusive and provides rich insights into API usage patterns, data flows, and potential security blind spots.',
    ],
    benefits: [
      'Gain complete and continuous visibility into your evolving API ecosystem.',
      'Identify and manage risks associated with unmanaged or "shadow" APIs, reducing your unknown attack surface by up to 90%.', // Example quantified benefit
      'Ensure compliance with data governance policies by knowing what data traverses which APIs.',
      'Understand API dependencies and potential impact of changes before they cause disruptions.',
      'Reduce manual effort in API documentation and inventory management significantly.',
    ],
    howItWorks: {
      title: "How API Discovery Works (Simplified):",
      steps: [
        "1. **Data Ingestion**: Securely ingests data from various sources (network traffic, API gateway logs, code repositories, existing documentation).",
        "2. **Pattern Analysis**: Rule-based analysis examines communication patterns, code signatures, and textual data to identify potential API endpoints, data structures, and undocumented services.",
        "3. **Schema Inference**: For discovered endpoints, Aran attempts to infer basic schema information and potential parameters.",
        "4. **Catalog Integration**: Discovered APIs are presented for review and then seamlessly integrated into the Centralized API Catalog with appropriate metadata suggestions."
      ]
    }
    // {/* TODO: Link to detailed doc page or demo */}
  },
  {
    id: 'api-threats',
    title: 'Threat Detection',
    icon: AlertTriangle,
    description: [
      'Our rule-based threat detection engine analyzes API traffic in real-time to identify and alert on malicious activities, anomalous behavior, and potential security breaches targeting your APIs.',
      'It employs heuristic analysis and pattern matching to distinguish between legitimate and malicious traffic, minimizing false positives and detecting zero-day threats. It detects common API attacks (like OWASP API Top 10), business logic abuse, data exfiltration attempts, and more. Customizable alerting and deep integration with SIEM/SOAR systems ensure prompt and effective incident response.',
    ],
    benefits: [
      'Proactively protect against a wide range of API attacks and sensitive data breaches.',
      'Significantly reduce false positives (e.g., by up to 75%) compared to traditional WAFs, thanks to context-aware analysis.', // Example quantified benefit
      'Accelerate incident response times with actionable alerts, rich contextual information, and remediation suggestions.',
      'Continuously adapt to evolving threat landscapes with rule-based analysis.',
      'Gain deep insights into attacker techniques and API abuse patterns.',
    ],
    howItWorks: {
        title: "How Threat Detection Works (Simplified):",
        steps: [
            "1. **Real-time Monitoring**: Captures and analyzes API request and response data from integrated sources.",
            "2. **Behavioral Baselining**: Rule-based engine learns normal API usage patterns for each API and user context.",
            "3. **Anomaly & Signature Detection**: Compares live traffic against learned baselines and known attack signatures (including OWASP API Top 10).",
            "4. **Threat Scoring & Alerting**: Anomalies and threats are scored based on severity and confidence. High-risk events trigger immediate alerts and can initiate automated responses or workflows."
        ]
    }
    // {/* TODO: Link to detailed doc page or demo */}
  },
  {
    id: 'mcp-catalog', // Combined with Governance
    title: 'MCP Catalog & Governance',
    icon: Network,
    description: [
      'Aran API Sentinel allows you to define and catalog your Model Context Protocol (MCP) implementations and meticulously map the APIs that support them. This provides an AI/ML-centric view of your API security and operational risk.',
      'Furthermore, it enables robust API governance by allowing you to associate specific policies, compliance mandates (e.g., PCI-DSS, HIPAA), and SLOs directly with these critical processes and their underlying APIs.',
    ],
    benefits: [
      'Prioritize security efforts and resource allocation based on direct business impact and risk.',
      'Understand the blast radius of API vulnerabilities or outages on critical business operations.',
      'Improve communication between business, development, and security teams regarding API-related risks and governance.',
      'Streamline compliance reporting by mapping controls and evidence to specific MCPs and APIs.',
      'Ensure critical APIs meet performance and availability targets through focused monitoring.',
    ],
    // {/* TODO: Link to detailed doc page or demo */}
  },
  {
    id: 'security-policies',
    title: 'Robust Security Policies',
    icon: ShieldCheck,
    description: [
      'Define, manage, and enforce granular security policies across your entire API landscape. Aran API Sentinel allows you to create custom policies or use pre-built templates based on industry best practices (like OWASP) and regulatory requirements.',
      'Policies can cover authentication (e.g., OAuth 2.0, mTLS), authorization (e.g., RBAC, ABAC), data encryption, rate limiting, input validation, Geo-fencing, and more. The platform continuously monitors for policy violations and can automate enforcement actions or trigger alerts.',
    ],
    benefits: [
      'Ensure consistent and auditable security posture across all APIs, reducing configuration drift.',
      'Automate compliance with internal standards and external regulations (GDPR, CCPA, etc.).',
      'Reduce manual effort in security configuration, auditing, and reporting by over X hours/month.', // Example quantified benefit
      'Adapt policies quickly to changing business needs or emerging threats with a flexible policy engine.',
      'Provide developers with clear security guidelines and guardrails early in the API lifecycle.',
    ],
    // {/* TODO: Link to detailed doc page or demo */}
  },
  {
    id: 'access-control',
    title: 'Comprehensive Access Control',
    icon: Users,
    description: [
      'Implement fine-grained, role-based access control (RBAC) and attribute-based access control (ABAC) for your APIs and the Aran API Sentinel platform itself. ',
      'Integrate seamlessly with existing Identity Providers (IdPs) like Okta, Azure AD, or Keycloak. Manage user roles, permissions, and API access tokens centrally, ensuring that only authorized users and services can access sensitive API functionalities and data.',
    ],
    benefits: [
      'Prevent unauthorized access to sensitive APIs and data, adhering to the principle of least privilege.',
      'Simplify user and permission management across a complex API ecosystem.',
      'Maintain detailed audit trails for access requests, administrative actions, and permission changes.',
      'Enhance security for both external and internal consumers of your APIs.',
    ],
    // {/* TODO: Link to detailed doc page or demo */}
  },
];

function ProductFeaturesPage() {
  return (
    <Layout
      title="Features - Aran API Sentinel" // Enhanced title
      description="Explore the comprehensive suite of tools Aran API Sentinel offers to discover, manage, secure, and govern your entire API landscape." // New subtitle
    >
      <div className={`container ${styles.featurePageContainer} margin-vert--lg`}>
        <header className="text--center margin-bottom--xl">
          <h1 className={styles.heroTitle}>Features of Aran API Sentinel</h1>
          <p className={styles.heroSubtitle}>
            Explore the comprehensive suite of tools Aran API Sentinel offers to discover, manage, secure, and govern your entire API landscape.
          </p>
        </header>

        {features.map((feature) => (
          <section key={feature.id} id={feature.id} className={styles.featureDetailSection}>
            <div className="flex items-center mb-4"> {/* Flex container for icon and title */}
              <feature.icon size={32} className="mr-3 text-primary shrink-0" /> {/* Icon rendering */}
              <h2 className="text-2xl !mb-0">{feature.title}</h2> {/* Removed bottom margin from h2 directly */}
            </div>
            {feature.description.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-4">{paragraph}</p> // Enhanced text style
            ))}
            {feature.benefits && feature.benefits.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mt-6 mb-2">Key Benefits:</h3>
                <ul className="list-disc list-inside space-y-1 text-lg">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </>
            )}
            {feature.howItWorks && (
              <div className={styles.howItWorksSection + " mt-6"}>
                <h4 className="text-lg font-semibold mb-2">{feature.howItWorks.title || "How it Works (Simplified):"}</h4>
                <ul className="list-decimal list-inside space-y-1 text-base bg-muted/50 p-4 rounded-md">
                  {feature.howItWorks.steps.map((step, index) => (
                    <li key={index} className="mb-1">{step}</li>
                  ))}
                </ul>
              </div>
            )}
             {/* TODO: Link to detailed doc page or demo */}
          </section>
        ))}
      </div>
    </Layout>
  );
}

export default ProductFeaturesPage;
