import { Body, Container, Section, Text } from "@react-email/components";
import React from "react";
import { render } from "@react-email/render";

type TwoFactorEmailProps = {
  email: string;
  token: string;
  expires: Date;
};

export function TwoFactorEmail({ email, token, expires }: TwoFactorEmailProps) {
  return (
    <Body>
      <Container>
        <Section>
          <Text>Email: {email}</Text>
          <Text>Token: {token}</Text>
          <Text>Expires: {expires.toLocaleString()}</Text>
        </Section>
      </Container>
    </Body>
  );
}

// eslint-disable-next-line react/jsx-props-no-spreading
export const twoFactorEmail = (props: TwoFactorEmailProps): string => render(<TwoFactorEmail {...props} />);
