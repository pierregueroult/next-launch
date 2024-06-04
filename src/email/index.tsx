import { render } from "@react-email/render";
import mailer from "nodemailer";
import type { MailOptions } from "nodemailer/lib/sendmail-transport";
import { ReactElement } from "react";

const transporter = mailer.createTransport(process.env.MAIL_SERVER);

type SendEmailParams = MailOptions & { template: ReactElement };

const sendEmail = ({ template, to, from, subject }: SendEmailParams) => {
  const html: string = render(template);
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

export default sendEmail;
