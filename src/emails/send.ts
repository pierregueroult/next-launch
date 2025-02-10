import { render } from "@react-email/render";
import { ReactElement } from "react";
import transporter from "@/emails/transporter";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

type Send = Omit<MailOptions, "html"> & {
  template: ReactElement<any> | string;
};

const send = async ({ template, ...options }: Send): Promise<void> => {
  transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "",
    html: typeof template === "string" ? template : await render(template),
    ...options,
  });
};

export default send;
