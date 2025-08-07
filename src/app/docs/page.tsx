import { readFileSync } from 'fs';
import { join } from 'path';

export default function DocsPage() {
  try {
    const contentPath = join(process.cwd(), 'content', 'docs', 'index.mdx');
    const content = readFileSync(contentPath, 'utf-8');
    
    return (
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Aran API Sentinel Documentation
          </h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🚀 Quick Start
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm">
{`# Clone the repository
git clone https://github.com/radhi1991/aran.git
cd aran

# Install dependencies
bun install

# Run complete setup
bun run setup

# Start the application
bun run dev`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📋 Access URLs
              </h2>
              <ul className="space-y-2">
                <li><strong>Frontend:</strong> http://localhost:9002</li>
                <li><strong>PocketBase Admin:</strong> http://127.0.0.1:8090/_/</li>
                <li><strong>Admin Login:</strong> radhithya1991@gmail.com / XypX6VjucJBp2Gx</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🏢 Sample Organizations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900">TechCorp</h3>
                  <p className="text-blue-700">admin@techcorp.com / admin123</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900">SecureBank</h3>
                  <p className="text-green-700">admin@securebank.com / admin123</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                ✨ Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900">🔐 Multi-Tenant Security</h3>
                  <p className="text-gray-600">Complete data separation between organizations</p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900">🛡️ API Security</h3>
                  <p className="text-gray-600">Rule-based and AI-powered security analysis</p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900">🤖 Hybrid AI</h3>
                  <p className="text-gray-600">Intelligent routing with local and cloud AI</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Aran API Sentinel Documentation
          </h1>
          <p className="text-gray-600">
            Documentation is being updated. Please check the README.md file for setup instructions.
          </p>
        </div>
      </div>
    );
  }
}
