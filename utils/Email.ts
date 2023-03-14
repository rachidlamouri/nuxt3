import sgMail from '@sendgrid/mail'
import colors from 'colors'

const config = useRuntimeConfig()

class Email {
  to: string
  firstname: string
  url: string
  token: string
  subject: string
  emailText: string
  emailHtml: string
  data: any
  constructor(data: any) {
    this.to = data.email
    this.firstname = data.name.split(' ')[0]
    this.url = data.url
    this.token = data.token
    this.subject = ''
    this.emailText = ''
    this.emailHtml = ''
    this.data = data
  }

  async send(templateId: string) {
    sgMail.setApiKey(config.sendgridApiKey as string)

    const msg: any = {
      to: {
        email: this.to,
        name: this.firstname,
      },
      from: {
        email: config.public.fromEmail,
        name: config.public.fromName,
      },
      replyTo: {
        email: config.public.fromEmail,
        name: config.public.fromName,
      },
      subject: this.subject,
      // template_id: templateId,
      // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
      text: this.emailText,
      html: this.emailHtml,
    }

    await sgMail.send(msg)
    // console.log(colors.green.bold('Message sent'))
  }

  async sendRegisterationEmail() {
    this.subject = 'Please confirm your email address'
    const verifyUrl = `${this.url}/auth`

    this.emailText = `
        Thank you for creating an account with ACS.
    
        Please copy and paste the link below in your browser to verify your email.
    
        ${this.url}/auth/verify?signupToken=${this.token}
    
        Sincerely,
        The ACS Team.
    
        You’re receiving this email because you recently created a new account with ACS. If this wasn’t you, please ignore this email.`

    this.emailHtml = `
        <p>Thank you for creating an account with ACS.</p>
        <p>Please click the link below to verify your account.</p>
        <p><a href='${this.url}/auth/verify?signupToken=${this.token}'>Click to confirm your email</a></p>
        <p>Can’t click the link? Copy and paste this link in your browser:</p>
        <p>${this.url}/auth/verify?signupToken=${this.token}</p>
        <p>Sincerely,<br>
        The ACS Team.</p>
        <p>You’re receiving this email because you recently created a new account with ACS. If this wasn’t you, please ignore this email.</p>
        `
    await this.send(config.sendgridSignupTemplateId as string)
  }

  async sendPasswordResetEmail() {
    this.subject = 'Your password reset token (valid for 1 hour)'
    this.emailText = `
    Please copy the url below and paste it in your browser to reset your password.
    ${this.url}/auth/resetpassword?passwordResetToken=${this.token}

    Sincerely,
    The ACS Team.
   `

    this.emailHtml = `
    <h3>Hello ${this.firstname},</h3>
    <p>Please click the link below to reset your password.</p>
    <p><a href='${this.url}/auth/resetpassword?passwordResetToken=${this.token}'>Click to reset your password</a></p>
    <p>Can’t click the link? Copy and paste this link in your browser:</p>
    <p>${this.url}/auth/resetpassword?passwordResetToken=${this.token}</p>
    <p> Sincerely,</>
    <p>The ACS Team.</p>
    `
    await this.send(config.sendgridPasswordResetTemplateId as string)
  }

  async sendPasswordResetSuccessEmail() {
    this.subject = 'Your password has been updated'
    this.emailText = `
    Your password has been updated

    Sincerely,
    The ACS Team.
   `

    this.emailHtml = `
    <h3>Hello ${this.firstname},</h3>
    <p>PYour password has been updated</p>
    <p> Sincerely,</>
    <p>The ACS Team.</p>
    `
    await this.send(config.sendgridPasswordResetTemplateId as string)
  }

  async sendOrderProcessing() {
    const subject = 'reset'
    const emailText = `
        Thank you for creating an account with ACS.
        `

    const emailHtml = `
        <p>Thank you for creating an account with ACS.</p>
        <p>Please click the link below to verify your account.</p>
        
        `
    await this.send(config.sendgridOrderReceivedTemplateId as string)
  }
}

export default Email

// sgMail.setApiKey(config.sendGridAoiKeyprocess.env.SENDGRID_API_KEY)

//         const msg = {
//           to: {
//             email: order.shippingAddress.email,
//             name: order.shippingAddress.name,
//           },

//           from: {
//             email: 'support@yrlus.com',
//             name: 'YRL Consulting',
//           },
//           replyTo: {
//             email: 'support@yrlus.com',
//             name: 'Abbas Lamouri',
//           },
//           subject: 'Thank you for your order',
//           template_id: process.env.ORDER_TEMPLATE_ID,
//           dynamic_template_data: {
//             retailer: 'YRL Consulting',
//             items: order.items,
//           },
//         }

//         console.log('SEND', await sgMail.send(msg))
