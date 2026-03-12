import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { getAppUrl } from '@/lib/app-url';

interface StripeWelcomeEmailProps {
  userName: string;
  courseTitle: string;
  courseImageUrl?: string | null;
}

const baseUrl = getAppUrl();

export const StripeWelcomeEmail = ({
  userName,
  courseTitle,
  courseImageUrl,
}: StripeWelcomeEmailProps) => {
  const heroImage = courseImageUrl || `${baseUrl}/logoWbg.png`;
  const isCourseImage = Boolean(courseImageUrl);

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Felicitations ! Vous avez acces a votre cours {courseTitle}</Preview>
        <Container style={container}>
          <Section style={box}>
            {isCourseImage ? (
              <Img
                src={heroImage}
                width="560"
                height="220"
                alt={courseTitle}
                style={courseHeroImage}
              />
            ) : (
              <Section style={brandWrap}>
                <Img
                  src={heroImage}
                  width="220"
                  alt="Elevate"
                  style={logoImage}
                />
              </Section>
            )}
            <Hr style={hr} />
            <Text style={paragraph}>
              Bonjour {userName},
            </Text>
            <Text style={paragraph}>
              Merci pour votre achat ! Vous avez maintenant accès au cours :
              <strong> {courseTitle}</strong>.
            </Text>
            <Button style={button} href="https://ton-site.com/dashboard">
              Accéder à mon espace membre
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>- L&apos;equipe de Ton App</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default StripeWelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const brandWrap = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '18px',
  padding: '18px 20px',
  textAlign: 'center' as const,
};

const logoImage = {
  display: 'block',
  height: 'auto',
  margin: '0 auto',
};

const courseHeroImage = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '560px',
  height: '220px',
  objectFit: 'cover' as const,
  borderRadius: '16px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',

  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '10px',
};
