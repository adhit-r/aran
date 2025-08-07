/**
 * Enhanced security types for comprehensive API security monitoring
 */

export interface SecurityMetrics {
  overallScore: number; // 0-100
  vulnerabilityCount: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  lastScanDate: Date;
  nextScanDate: Date;
  complianceScore: number; // 0-100
  quantumReadinessScore: number; // 0-100
}

export interface SecurityAlert {
  id: string;
  apiId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'encryption' | 'input_validation' | 'rate_limiting' | 'quantum_threat';
  title: string;
  description: string;
  detectedAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  remediation?: string;
  cveIds?: string[];
  cvssScore?: number;
}

export interface ComplianceCheck {
  id: string;
  standard: 'OWASP_API_TOP_10' | 'NIST_CYBER_FRAMEWORK' | 'ISO_27001' | 'SOC_2' | 'GDPR' | 'HIPAA';
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  description: string;
  lastChecked: Date;
  remediationSteps?: string[];
}

export interface SecurityTrend {
  date: Date;
  vulnerabilityCount: number;
  securityScore: number;
  alertCount: number;
  complianceScore: number;
}

export interface APISecurityProfile {
  apiId: string;
  name: string;
  endpoint: string;
  securityMetrics: SecurityMetrics;
  recentAlerts: SecurityAlert[];
  complianceChecks: ComplianceCheck[];
  lastUpdated: Date;
} 