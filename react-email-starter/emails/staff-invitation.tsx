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

interface StaffInvitationEmailProps {
  invitedByEmail?: string;
  inviteUrl: string;
}

const baseUrl = getAppUrl();

export const StaffInvitationEmail = ({
  invitedByEmail,
  inviteUrl,
}: StaffInvitationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Invitation a rejoindre l&apos;equipe Elevate</Preview>
      <Container style={container}>
        <Section style={box}>
          <Section style={brandWrap}>
            <Img
              src={`${baseUrl}/logoWbg.png`}
              width="220"
              alt="Elevate"
              style={brandLogo}
            />
          </Section>
          <Hr style={hr} />
          <Text style={paragraph}>
            Bonjour,
          </Text>
          <Text style={paragraph}>
            Vous avez ete invite{invitedByEmail ? ` par ${invitedByEmail}` : ''} a rejoindre l&apos;equipe d&apos;administration sur <strong>Elevate</strong>.
          </Text>
          <Text style={paragraph}>
            Cliquez sur le bouton ci-dessous pour accepter l&apos;invitation et acceder a la page de validation :
          </Text>
          <Button style={button} href={inviteUrl}>
            Accepter l&apos;invitation
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Si vous n&apos;attendiez pas cette invitation, vous pouvez ignorer cet email. Ce lien est unique et securise.
          </Text>
          <Text style={footer}>- L&apos;equipe Elevate</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

StaffInvitationEmail.PreviewProps = {
  invitedByEmail: 'admin@elevate.com',
  inviteUrl: 'http://localhost:3000/admin/acceptance?token=exemple_token',
} as StaffInvitationEmailProps;

export default StaffInvitationEmail;

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

const brandLogo = {
  display: 'block',
  height: 'auto',
  margin: '0 auto',
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

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
