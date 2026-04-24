import { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from "@/contexts/UserContext";
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "expo-router";
import fetchData from "@/hooks/fetchData";

type JwtPayload = {
    user: any
}

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [isStep2, setIsStep2] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useContext(UserContext);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setError(null);
            const response = await fetchData('/auth/login', 'POST', { username, password }, false)
            
            if (response.require2FA) {
                setIsStep2(true);
            } else {
                setError("Réponse inattendue du serveur");
            }
        } catch(err: any) {
            console.log('Login error ', err)
            setError(err.message);
        }
    }

    const handleVerify2FA = async () => {
        try {
            setError(null);
            const response = await fetchData('/auth/verify-2fa', 'POST', { username, code }, false)
            
            if (response.token) {
                await AsyncStorage.setItem('token', response.token);
                if (response.refreshToken) {
                    await AsyncStorage.setItem('refreshToken', response.refreshToken);
                }
                const decoded = jwtDecode<JwtPayload>(response.token);
                setUser(decoded.user);
                router.push({ pathname: '/' });
            } else {
                setError(response.message || "Code invalide");
            }
        } catch(err: any) {
            setError(err.message);
        }
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>AssurMoi</Text>
                    
                    {!isStep2 ? (
                        <>
                            <TextInput
                                label="Identifiant"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Mot de passe"
                                value={password}
                                secureTextEntry
                                onChangeText={setPassword}
                                style={styles.input}
                                mode="outlined"
                            />
                            <HelperText type="error" visible={Boolean(error)}>
                                {error}
                            </HelperText>
                            <Button
                                mode="contained"
                                onPress={handleLogin}
                                style={styles.button}
                            >
                                Suivant
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text style={styles.subtitle}>Entrez le code reçu par email</Text>
                            <TextInput
                                label="Code de vérification"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                style={styles.input}
                                mode="outlined"
                            />
                            <HelperText type="error" visible={Boolean(error)}>
                                {error}
                            </HelperText>
                            <Button
                                mode="contained"
                                onPress={handleVerify2FA}
                                style={styles.button}
                            >
                                Vérifier
                            </Button>
                            <Button
                                mode="text"
                                onPress={() => setIsStep2(false)}
                            >
                                Retour
                            </Button>
                        </>
                    )}
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    card: {
        elevation: 4
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2196F3'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 10
    },
    input: {
        marginBottom: 10
    },
    button: {
        marginTop: 10,
        paddingVertical: 5
    }
});