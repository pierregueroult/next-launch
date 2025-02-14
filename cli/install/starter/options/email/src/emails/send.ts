import { render } from "@react-email/render";
import { ReactElement } from "react";
import transporter from "./transporter";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

type Send = Omit<MailOptions, "html"> & {
  template: ReactElement<unknown> | string;
};

async function send({ template, ...options }: Send): Promise<void> {
  transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "",
    html: typeof template === "string" ? template : await render(template),
    ...options,
  });
}

export default send;
