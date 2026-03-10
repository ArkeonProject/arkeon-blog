import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";

interface WelcomeNewsletterProps {
  email?: string;
}

export default function WelcomeNewsletter({ email = "" }: WelcomeNewsletterProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Arkeonix Labs — technical analysis in your inbox</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <div style={logoWrapper}>
              <span style={logoMark}>A</span>
              <span style={logoText}>Arkeonix Labs</span>
            </div>
          </Section>

          {/* Divider */}
          <div style={gradientBar} />

          {/* Main content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to the lab.</Heading>

            <Text style={paragraph}>
              You&apos;re now part of <strong>Arkeonix Labs</strong> — a technical
              publication focused on in-depth analysis, product reviews, and
              infrastructure guides crafted with precision.
            </Text>

            <Text style={paragraph}>
              Here&apos;s what you&apos;ll receive in your inbox:
            </Text>

            <Section style={featureList}>
              <div style={featureItem}>
                <span style={featureDot}>◆</span>
                <Text style={featureText}>
                  <strong>Technical deep-dives</strong> — CPU reviews, server builds, hardware benchmarks
                </Text>
              </div>
              <div style={featureItem}>
                <span style={featureDot}>◆</span>
                <Text style={featureText}>
                  <strong>Lab experiments</strong> — infrastructure guides, deployment walkthroughs
                </Text>
              </div>
              <div style={featureItem}>
                <span style={featureDot}>◆</span>
                <Text style={featureText}>
                  <strong>Tech news</strong> — curated and analyzed under the Arkeonix standard
                </Text>
              </div>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href="https://www.arkeonixlabs.com/blog">
                Read the latest analysis →
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={footer}>
              You subscribed with{" "}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
              . If this was a mistake, you can ignore this email — you won&apos;t
              receive any further messages until confirmed.
            </Text>

            <Text style={footerBrand}>
              © {new Date().getFullYear()} Arkeonix Labs · Built with precision
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#0d1117",
  fontFamily: "'Outfit', 'Helvetica Neue', Arial, sans-serif",
  margin: "0",
  padding: "40px 0",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#111827",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.07)",
};

const header: React.CSSProperties = {
  padding: "28px 40px 24px",
  backgroundColor: "#0d1117",
};

const logoWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const logoMark: React.CSSProperties = {
  display: "inline-flex",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  fontWeight: "800",
  color: "#ffffff",
  textAlign: "center",
  lineHeight: "32px",
};

const logoText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f8fafc",
  letterSpacing: "-0.02em",
};

const gradientBar: React.CSSProperties = {
  height: "2px",
  background: "linear-gradient(90deg, transparent, #6366f1, #a78bfa, #6366f1, transparent)",
};

const content: React.CSSProperties = {
  padding: "40px 40px 32px",
};

const h1: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#f8fafc",
  letterSpacing: "-0.03em",
  lineHeight: "1.2",
  margin: "0 0 20px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "rgba(248,250,252,0.75)",
  margin: "0 0 16px",
};

const featureList: React.CSSProperties = {
  margin: "24px 0",
  padding: "20px 24px",
  backgroundColor: "rgba(99,102,241,0.08)",
  borderRadius: "12px",
  border: "1px solid rgba(99,102,241,0.2)",
};

const featureItem: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "12px",
};

const featureDot: React.CSSProperties = {
  color: "#818cf8",
  fontSize: "10px",
  marginTop: "4px",
  flexShrink: 0,
};

const featureText: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "rgba(248,250,252,0.8)",
  margin: "0",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "32px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#6366f1",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "700",
  textDecoration: "none",
  display: "inline-block",
  letterSpacing: "-0.01em",
};

const divider: React.CSSProperties = {
  borderColor: "rgba(255,255,255,0.08)",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.6",
  color: "rgba(248,250,252,0.35)",
  margin: "0 0 8px",
};

const footerBrand: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(248,250,252,0.25)",
  margin: "0",
  letterSpacing: "0.02em",
};

const link: React.CSSProperties = {
  color: "#818cf8",
  textDecoration: "underline",
};
