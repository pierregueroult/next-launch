import { ReactElement } from "react";
import { render } from "@react-email/render";
import transporter from "@/emails/transporter";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

type Send = Omit<MailOptions, "html"> & {
  template: ReactElement | string;
};

const send = ({ template, ...options }: Send) => {
  transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "",
    html: typeof template === "string" ? template : render(template),
    ...options,
  });
};

export default send;
