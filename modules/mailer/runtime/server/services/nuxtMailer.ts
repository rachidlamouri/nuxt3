import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'
import AppError from '~/utils/AppError'

const config = useRuntimeConfig()

export const sendMail = async (html: string) => {
  const emailRecipients = config.mailer.emailRecipients.filter((r) => r)
  let info
  if (config.mailer.mailTransporter === 'nodemailer') {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: Boolean(true), // use TLS
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })

    info = await transporter.sendMail({
      from: 'Care <care@abbaslamouri.com>',
      to: emailRecipients,
      subject: config.mailer.contactFormEmailSubject,
      html,
    })
    if (info.rejected)
      throw new AppError(`The following emails have been rejected ${info.rejected.join(', ')}`, 'emails_rejected', 400)
  } else if (config.mailer.mailTransporter === 'sendgrid') {
    sgMail.setApiKey(config.sendgridApiKey as string)

    const msg = {
      to: emailRecipients,
      from: {
        email: config.mailer.fromEmail,
        name: config.mailer.fromName,
      },
      replyTo: {
        email: config.mailer.fromEmail,
        name: config.mailer.fromName,
      },
      subject: config.mailer.contactFormEmailSubject,
      // template_id: templateId,
      // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
      // text: ``,
      html,
    }
    info = await sgMail.sendMultiple(msg)
  }
  return info
}
