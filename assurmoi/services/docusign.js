/**
 * Mock Service pour DocuSign
 * En production, cela utiliserait docusign-esign SDK
 */

exports.sendForSignature = async (documentPath, signerEmail, signerName) => {
    console.log(`[DocuSign Mock] Envoi du document ${documentPath} pour signature à ${signerName} (${signerEmail})`);
    
    // Simule un appel API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                envelopeId: `mock-env-${Math.random().toString(36).substr(2, 9)}`,
                status: 'sent'
            });
        }, 1000);
    });
};

exports.checkSignatureStatus = async (envelopeId) => {
    console.log(`[DocuSign Mock] Vérification du statut pour l'enveloppe ${envelopeId}`);
    
    // Simule une signature complétée
    return {
        status: 'completed',
        signedAt: new Date()
    };
};
