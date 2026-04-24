const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { send2FACodeEmail, sendLoginAlertEmail, sendPasswordResetEmail } = require('../utils/mailer')

require('dotenv').config()

/**
 * Première étape du login : vérification du mot de passe et envoi du code 2FA
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ 
            where: { username } 
        })
        
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' })

        if (!user.active) return res.status(403).json({ message: 'Compte inactif' })

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(401).json({ message: 'Mot de passe invalide' })

        // Générer un code 2FA (6 chiffres)
        const twoStepCode = Math.floor(100000 + Math.random() * 900000).toString()
        user.two_step_code = twoStepCode
        await user.save()

        // Envoyer le code par email
        await send2FACodeEmail(user, twoStepCode)

        return res.status(200).json({
            message: 'Code de vérification envoyé par email',
            require2FA: true,
            username: user.username
        })

    } catch (error) {
        console.error('Error during login step 1:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Deuxième étape du login : vérification du code 2FA et génération du JWT
 */
const verify2FA = async (req, res) => {
    try {
        const { username, code } = req.body

        const user = await User.findOne({ where: { username } })
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' })

        if (user.two_step_code !== code) {
            return res.status(401).json({ message: 'Code invalide' })
        }

        // Code valide, on le reset
        user.two_step_code = null
        
        const token = jwt.sign({ user: user.clean() }, process.env.SECRET_KEY, { expiresIn: '1h' })
        const refreshToken = jwt.sign({ user: user.clean() }, process.env.SECRET_KEY, { expiresIn: '7d' })

        user.token = token
        user.refresh_token = refreshToken
        await user.save()

        await sendLoginAlertEmail(user)

        return res.status(200).json({
            token,
            refreshToken,
            user: user.clean()
        })

    } catch (error) {
        console.error('Error during 2FA verification:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Demande de réinitialisation de mot de passe
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ where: { email } })
        
        if (!user) {
            // Pour des raisons de sécurité, on ne dit pas si l'email existe ou pas
            return res.status(200).json({ message: 'Si cet email correspond à un compte, un lien de réinitialisation a été envoyé.' })
        }

        const resetToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        
        await sendPasswordResetEmail(user, resetToken)

        return res.status(200).json({ message: 'Lien de réinitialisation envoyé' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Confirmation de réinitialisation de mot de passe
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        
        const user = await User.findByPk(decoded.id)
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' })

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' })
    } catch (error) {
        res.status(401).json({ message: 'Lien invalide ou expiré' })
    }
}

const logout = async (req, res) => {
    if (req.user) {
        const user = await User.findByPk(req.user.id)
        if (user) {
            user.token = null
            user.refresh_token = null
            await user.save()
        }
    }
    return res.status(200).json({ message: 'Logged out!' })
}

module.exports = { login, verify2FA, requestPasswordReset, resetPassword, logout }