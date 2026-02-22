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
import * as React from 'react';

interface StaffInvitationEmailProps {
  invitedByEmail?: string;
  inviteUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const StaffInvitationEmail = ({
  invitedByEmail,
  inviteUrl,
}: StaffInvitationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Invitation à rejoindre l'équipe Elevate</Preview>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="180"
            height="60"
            alt="Elevate"
            style={{ margin: "0 auto" }}
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Bonjour,
          </Text>
          <Text style={paragraph}>
            Vous avez été invité{invitedByEmail ? ` par ${invitedByEmail}` : ''} à rejoindre l'équipe d'administration sur <strong>Elevate</strong>.
          </Text>
          <Text style={paragraph}>
            Cliquez sur le bouton ci-dessous pour accepter l'invitation et accéder à la page de validation :
          </Text>
          <Button style={button} href={inviteUrl}>
            Accepter l'invitation
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email. Ce lien est unique et sécurisé.
          </Text>
          <Text style={footer}>— L'équipe Elevate</Text>
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
