import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-gradient-gold">Terms of Service</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

            <div className="prose prose-invert mt-8 max-w-none space-y-8">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  By accessing and using the Pantero waitlist service, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">2. Waitlist Service</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The Pantero waitlist allows users to register their interest in the Pantero platform. Joining the waitlist does not guarantee access to the platform. Access will be granted based on position and availability at the time of launch.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">3. Referral Program</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our referral program allows users to improve their waitlist position by referring others. Each successful referral moves you up on the waitlist. We reserve the right to modify, suspend, or terminate the referral program at any time. Fraudulent referrals (self-referrals, fake accounts, etc.) will result in removal from the waitlist.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">4. User Conduct</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You agree to:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Provide accurate and truthful information</li>
                  <li>Not create multiple accounts to gain unfair advantage</li>
                  <li>Not use automated tools or bots to interact with the service</li>
                  <li>Not engage in fraudulent referral activities</li>
                  <li>Not interfere with or disrupt the service</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">5. Intellectual Property</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  All content, trademarks, and intellectual property on the Pantero platform are owned by Pantero or its licensors. You may not use, reproduce, or distribute any content without prior written permission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Pantero is provided on an &quot;as is&quot; basis. We make no warranties, expressed or implied, regarding the reliability, availability, or suitability of the service. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">7. Changes to Terms</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Continued use of the service after changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground">8. Contact</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Questions about these Terms of Service should be directed to us through our social media channels or email at legal@pantero.com.
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
