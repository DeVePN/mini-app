import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>

        <Card className="p-6 mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Hackathon Demo Project
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This is a demonstration project. This privacy policy outlines how data is handled
                in this proof-of-concept application. Do not use this service with sensitive or
                personal data.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground">
              DeVPN (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) is a hackathon demonstration project showcasing
              decentralized VPN technology on the TON blockchain. This privacy policy explains how
              information is collected and used within this demo application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">2.1 Wallet Information</h3>
                <p className="text-muted-foreground">
                  When you connect your TON wallet, we collect your wallet address for authentication
                  purposes. This is stored locally in your browser and may be sent to our backend
                  for session management.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.2 Telegram Data</h3>
                <p className="text-muted-foreground">
                  As a Telegram Mini App, we may receive basic Telegram user information (user ID,
                  username) provided by the Telegram platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.3 Usage Data</h3>
                <p className="text-muted-foreground">
                  We collect mock usage data (session duration, data transferred) for demonstration
                  purposes. In this demo, most data is simulated and not actual network traffic.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Information</h2>
            <p className="text-muted-foreground mb-2">Information collected is used to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Authenticate users via TON wallet connection</li>
              <li>Demonstrate VPN session management features</li>
              <li>Display mock usage statistics and billing information</li>
              <li>Test and develop the proof-of-concept application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Storage</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">4.1 Local Storage</h3>
                <p className="text-muted-foreground">
                  Wallet connection information and app preferences are stored in your browser&apos;s
                  local storage. You can clear this data at any time through your browser settings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4.2 Backend Storage</h3>
                <p className="text-muted-foreground">
                  User profiles and session data may be stored in our development database (Supabase)
                  for testing purposes. This is a development environment and data may be deleted
                  without notice.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. No Real Privacy Protection</h2>
            <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Important:</strong> This is a demo application and does NOT provide real
                    VPN privacy or security. All VPN connections are simulated. Do not use this
                    service for any activities requiring actual privacy, security, or anonymity.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Blockchain Transparency</h2>
            <p className="text-muted-foreground">
              All transactions on the TON blockchain are public and permanent. While we use testnet
              tokens with no real value, any blockchain interactions are publicly visible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
            <p className="text-muted-foreground mb-2">This demo application uses:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>TON Connect:</strong> For wallet authentication</li>
              <li><strong>Telegram:</strong> As the hosting platform</li>
              <li><strong>Supabase:</strong> For development database</li>
              <li><strong>Railway:</strong> For backend hosting</li>
              <li><strong>Vercel:</strong> For frontend hosting (when deployed)</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Each service has its own privacy policy and data handling practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Data Security</h2>
            <p className="text-muted-foreground">
              While we implement basic security measures, this is a hackathon demo and should not
              be trusted with sensitive information. Standard security practices for production
              applications are not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              This Service is not intended for children under 13 years of age. We do not knowingly
              collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Your Rights</h2>
            <p className="text-muted-foreground mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Disconnect your wallet at any time</li>
              <li>Clear local storage data through your browser</li>
              <li>Request deletion of your test data from our database</li>
              <li>Stop using the Service at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              This privacy policy may be updated as the project evolves. Continued use of the
              Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions about this privacy policy or data handling practices, please contact
              the development team through the project repository or hackathon channels.
            </p>
          </section>

          <section className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This privacy policy applies only to this hackathon demonstration project.
            </p>
          </section>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
