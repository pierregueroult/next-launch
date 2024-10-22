import { Body, Container, Heading, Link, Section, Text } from "@react-email/components";
import React from "react";
import { render } from "@react-email/render";

type VerificationEmailProps = {
  email: string;
  token: string;
};

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

// eslint-disable-next-line react/jsx-props-no-spreading
export const verificationEmail = (props: VerificationEmailProps): string => render(<VerificationEmail {...props} />);
