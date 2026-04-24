import fetchData from "@/hooks/fetchData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, Divider, Chip, List, ActivityIndicator } from "react-native-paper";

type SinistreType = {
  id: number | string,
  reference: string,
  immatriculation?: string,
  conducteur_nom?: string,
  conducteur_prenom?: string,
  is_conducteur_assure?: boolean,
  date_appel?: any,
  date_accident?: any,
  contexte?: string,
  responsabilite_pourcentage?: number,
  status_validation: string,
  Assure?: {
    firstname: string,
    lastname: string,
    email: string
  }
}

export default function SinistreDetailScreen() {
    const [ sinistre, setSinistre ] = useState<SinistreType | null>(null)
    const [ loading, setLoading ] = useState(true)
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        fetchData('/sinistres/'+id, 'GET', {}, true)
            .then(res => {
                if (res.success) setSinistre(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log('Error on get sinistre ' + err.message)
                setLoading(false)
            })
    }, [id])

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />

    if(!sinistre) {
        return (
            <View style={styles.center}>
                <Text>Le sinistre est introuvable !</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title 
                    title={"Sinistre " + sinistre.reference} 
                    subtitle={new Date(sinistre.date_accident).toLocaleString()}
                />
                <Card.Content>
                    <View style={styles.statusRow}>
                        <Text variant="titleMedium">Statut :</Text>
                        <Chip style={styles.chip}>{sinistre.status_validation}</Chip>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <List.Section>
                        <List.Subheader>Informations Véhicule & Conducteur</List.Subheader>
                        <List.Item title="Immatriculation" description={sinistre.immatriculation} left={props => <List.Icon {...props} icon="car" />} />
                        <List.Item 
                            title="Conducteur" 
                            description={`${sinistre.conducteur_prenom} ${sinistre.conducteur_nom}`} 
                            left={props => <List.Icon {...props} icon="account" />} 
                        />
                        <List.Item 
                            title="L'assuré était-il au volant ?" 
                            description={sinistre.is_conducteur_assure ? "Oui" : "Non"} 
                            left={props => <List.Icon {...props} icon="help-circle" />} 
                        />
                    </List.Section>

                    <Divider style={styles.divider} />

                    <List.Section>
                        <List.Subheader>Détails du Sinistre</List.Subheader>
                        <List.Item title="Date d'accident" description={new Date(sinistre.date_accident).toLocaleString()} />
                        <List.Item title="Date d'appel" description={new Date(sinistre.date_appel).toLocaleString()} />
                        <List.Item 
                            title="Responsabilité" 
                            description={`${sinistre.responsabilite_pourcentage}% engagée`} 
                            left={props => <List.Icon {...props} icon="alert" />} 
                        />
                    </List.Section>

                    <Divider style={styles.divider} />
                    
                    <Text variant="titleMedium">Contexte :</Text>
                    <Text variant="bodyMedium" style={styles.contextText}>{sinistre.contexte}</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        margin: 10,
        elevation: 2
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    chip: {
        marginLeft: 10
    },
    divider: {
        marginVertical: 10
    },
    contextText: {
        marginTop: 5,
        fontStyle: 'italic',
        color: '#666'
    }
})