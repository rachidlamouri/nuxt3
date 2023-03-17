export default (name: string, subject: string, url: string, token: string) => {
  return `
  	<p>Hello ${name},</p>
		<p>Thank you for creating an account with YRL Conculting, LLC.</p>
        <p>Please click the link below to verify your account.</p>
        <p>Can’t click the link? Copy and paste this link in your browser:</p>
        <p>${url}/auth/verify?signupToken=${token}</p>
        <p>Sincerely,<br>
        The YRL Consulting Team.</p>
        <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
		<p>---</p>
		<p>Date: ${new Date(Date.now()).toDateString()}</p>
		<p>Time: ${new Date(Date.now()).getUTCHours()}: ${new Date(Date.now()).getUTCMinutes()}</p>

		<p>
			Sometimes you just want to send a simple HTML email with a simple design and clear call to
			action. This is it.
		</p>
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
			<tbody>
				<tr>
					<td align="left">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td><a href="${url}/auth/verify?signupToken=${token}" target="_blank">Click to confirm your email</a></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<p>
			This is a really simple email template. Its sole purpose is to get the recipient to click the
			button with no distractions.
		</p>
		<p>Good luck! Hope it works.</p>
	`
}
