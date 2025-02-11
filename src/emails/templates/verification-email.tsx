import { Body, Container, Heading, Link, Section, Text } from "@react-email/components";
import { render } from "@react-email/render";
import React from "react";

type VerificationEmailProps = Readonly<{
  email: string;
  token: string;
}>;

export function VerificationEmail({ email, token }: VerificationEmailProps) {
  const link = `${process.env.APP_URL}/auth?action=verify&token=${token}`;

  return (
    <Body>
      <Container>
        <Heading>Bienvenue</Heading>
        <Section>
          <Text>Bonjour {email}, merci de nous avoir contacté pour vérifier votre adresse email.</Text>
          <Text>
            Si vous n&apos;êtes pas à l&apos;origine de cette demande, merci de ne pas répondre à cette email.
          </Text>
          <Link href={link}>Cliquez ici pour valider votre adresse email</Link>
        </Section>
      </Container>
    </Body>
  );
}

export async function verificationEmail({ email, token }: VerificationEmailProps): Promise<string> {
  return render(<VerificationEmail email={email} token={token} />);
}
