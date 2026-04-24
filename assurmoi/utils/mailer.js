const {createTransport} = require('nodemailer')

const transporter = createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

// Fonction asynchrone pour envoyer un mail
async function sendMail(to, subject, text, html = null) {
    try {
        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@assurmoi.fr',
            to: to,
            subject: subject,
            text: text,
            html: html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: error.message }
    }
}

async function sendLoginAlertEmail(user) {
    return sendMail(
        user.email,
        'Nouvelle connexion à votre compte AssurMoi',
        `Une nouvelle connexion à votre compte a été détectée à ${new Date().toLocaleString()}. Si vous n'êtes pas à l'origine de cette action, veuillez changer votre mot de passe immédiatement.`
    );
}

async function send2FACodeEmail(user, code) {
    return sendMail(
        user.email,
        'Code de vérification AssurMoi',
        `Votre code de vérification est : ${code}. Ce code est valable pour 10 minutes.`,
        `<p>Votre code de vérification est : <strong>${code}</strong></p><p>Ce code est valable pour 10 minutes.</p>`
    );
}

async function sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/reset-password?token=${token}`;
    return sendMail(
        user.email,
        'Réinitialisation de votre mot de passe AssurMoi',
        `Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : ${resetUrl}`,
        `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : <a href="${resetUrl}">${resetUrl}</a></p>`
    );
}

async function sendMailDocumentsRequested(user, data) {
    return sendMail(
        user.email,
        `Action requise : Sinistre ${data.reference}`,
        `Un nouveau sinistre a été créé avec la référence ${data.reference}. Veuillez vous connecter à l'application pour fournir les documents nécessaires.`,
        `<p>Un nouveau sinistre a été créé avec la référence <strong>${data.reference}</strong>.</p><p>Veuillez vous connecter à l'application pour fournir les documents nécessaires.</p>`
    );
}

module.exports = { 
    sendMail, 
    sendLoginAlertEmail, 
    send2FACodeEmail, 
    sendPasswordResetEmail,
    sendMailDocumentsRequested
}