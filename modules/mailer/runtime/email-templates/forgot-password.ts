export default (name: string, url: string, token: string) => {
  return `
  	<p>Hello ${name},</p>
		<p>Please click the link below to reset your password.</p>
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
			<tbody>
				<tr>
					<td align="left">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0">
							<tbody>
							
								<tr>
									<td><a href="${url}/auth/resetpassword?passwordResetToken=${token}" target="_blank">Click to confirm your email</a></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<p></p>
		<p>Can’t click the link? Copy and paste this link in your browser:</p>
		<p>${url}/auth/resetpassword?passwordResetToken=${token}</p>
		<p>Sincerely,<br>
		The YRL Consulting Team.</p>
		<p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
	`
}
