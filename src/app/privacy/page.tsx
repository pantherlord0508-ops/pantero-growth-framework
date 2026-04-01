import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-gradient-gold">Privacy Policy</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

            <div className="prose prose-invert mt-8 max-w-none space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">1. Information We Collect</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  When you join the Pantero waitlist, we collect the following information:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>WhatsApp number (with country code)</li>
                  <li>How you heard about Pantero</li>
                  <li>Optional company/role information</li>
                  <li>Referral information (who referred you, if applicable)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>To maintain your position on the waitlist</li>
                  <li>To send you updates about Pantero&apos;s launch and progress</li>
                  <li>To manage the referral program</li>
                  <li>To send milestone notifications and important announcements</li>
                  <li>To improve our services and understand user demographics</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Your data is stored securely using Supabase, which provides enterprise-grade security with encryption at rest and in transit. We implement industry-standard security measures to protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">4. Data Sharing</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for analytics purposes. Your information may be shared with service providers who assist in operating our platform, subject to strict confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">5. Email Communications</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  By joining the waitlist, you agree to receive transactional emails related to your account, including welcome emails, milestone notifications, and important updates. You can unsubscribe from marketing emails at any time.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">6. Your Rights</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent at any time</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">7. Contact Us</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  If you have any questions about this Privacy Policy or your data, please contact us through our social media channels or email us at privacy@pantero.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
