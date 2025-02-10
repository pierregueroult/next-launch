import { Body, Container, Section, Text } from "@react-email/components";
import { render } from "@react-email/render";
import React from "react";

type TwoFactorEmailProps = Readonly<{
  email: string;
  token: string;
  expires: Date;
}>;

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

export async function twoFactorEmail({ email, token, expires }: TwoFactorEmailProps): Promise<string> {
  return render(<TwoFactorEmail email={email} token={token} expires={expires} />);
}
