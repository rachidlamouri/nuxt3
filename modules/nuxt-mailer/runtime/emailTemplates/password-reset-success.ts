export default (name: string) => {
  return `
  	<p>Hello ${name},</p>
		<p>your pasword was reset succesfully.</p>
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
			<tbody>
				<tr>
					<td align="left">
						<table role="presentation" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td></td>password eeset succesfull</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
		<p></p>
		<p>Sincerely,<br>
		The YRL Consulting Team.</p>
		<p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
	`
}
