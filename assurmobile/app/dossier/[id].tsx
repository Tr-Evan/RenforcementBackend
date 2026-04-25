import fetchData from "@/hooks/fetchData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useContext } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, Divider, Chip, List, Button, ActivityIndicator, Portal, Modal, TextInput } from "react-native-paper";
import { UserContext } from "@/contexts/UserContext";

type DossierType = {
  id: number | string,
  num_dossier: string,
  status: string,
  scenario_type: string,
  date_expertise_planifiee: string,
  date_expertise_effective: string,
  diagnostic_reparable: boolean,
  montant_indemnisation_estime: number,
  approbation_client_indemnite: boolean,
  is_clos: boolean,
  sinistre?: any
}

export default function DossierDetailScreen() {
    const [ dossier, setDossier ] = useState<DossierType | null>(null)
    const [ loading, setLoading ] = useState(true)
    const [ actionLoading, setActionLoading ] = useState(false)
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useContext(UserContext);

    const loadDossier = () => {
        setLoading(true)
        fetchData('/dossiers/'+id, 'GET', {}, true)
            .then(res => {
                if (res.success) setDossier(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log('Error loading dossier', err)
                setLoading(false)
            })
    }

    useEffect(() => {
        loadDossier()
    }, [id])

    const handleNextStep = async (nextStatus: string, data: any = {}) => {
        setActionLoading(true);
        try {
            const res = await fetchData(`/dossiers/${id}/step`, 'PATCH', {
                next_status: nextStatus,
                data
            }, true);
            if (res.success) {
                setDossier(res.data);
            }
        } catch (err) {
            console.error('Error updating step', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />

    if(!dossier) return <View style={styles.center}><Text>Dossier introuvable</Text></View>

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title 
                    title={"Dossier " + dossier.num_dossier} 
                    subtitle={"Statut: " + dossier.status}
                    right={() => <Chip style={styles.chip}>{dossier.is_clos ? 'CLOS' : 'EN COURS'}</Chip>}
                />
                <Card.Content>
                    <Text variant="titleMedium">Progression du dossier</Text>
                    <Divider style={styles.divider} />

                    {/* Actions basées sur le statut et le rôle */}
                    <View style={styles.actionSection}>
                        {dossier.status === 'INITIALISE' && user?.role !== 'INSURED' && (
                            <Button mode="contained" onPress={() => handleNextStep('EXPERTISE_PLANIFIEE', { date_expertise_planifiee: new Date() })}>
                                Planifier l'expertise
                            </Button>
                        )}
                        
                        {dossier.status === 'EXPERTISE_PLANIFIEE' && user?.role !== 'INSURED' && (
                            <Button mode="contained" onPress={() => handleNextStep('EXPERTISE_REALISEE', { date_expertise_effective: new Date() })}>
                                Confirmer expertise réalisée
                            </Button>
                        )}

                        {dossier.status === 'EXPERTISE_REALISEE' && user?.role !== 'INSURED' && (
                            <View style={{ gap: 10 }}>
                                <Button mode="contained" onPress={() => handleNextStep('INTERVENTION_A_PLANIFIER', { 
                                    date_retour_expertise: new Date(),
                                    diagnostic_reparable: true 
                                })}>
                                    Véhicule Réparable (Scenario 1)
                                </Button>
                                <Button mode="contained" color="orange" onPress={() => handleNextStep('INDEMNISATION_ESTIMEE', { 
                                    date_retour_expertise: new Date(),
                                    diagnostic_reparable: false,
                                    montant_indemnisation_estime: 5000 
                                })}>
                                    Véhicule non réparable (Scenario 2)
                                </Button>
                            </View>
                        )}

                        {dossier.status === 'INDEMNISATION_ESTIMEE' && user?.role === 'INSURED' && (
                            <View style={{ gap: 10 }}>
                                <Text>Indemnisation estimée : {dossier.montant_indemnisation_estime}€</Text>
                                <Button mode="contained" onPress={() => handleNextStep('INDEMNISATION_VALIDEE', { approbation_client_indemnite: true })}>
                                    Accepter l'indemnisation
                                </Button>
                            </View>
                        )}

                        {dossier.status === 'INDEMNISATION_VALIDEE' && user?.role === 'INSURED' && (
                            <Button mode="contained" onPress={() => handleNextStep('INDEMNISATION_ATTENTE_REGLEMENT', { 
                                date_previsionnelle_prise_en_charge: new Date(),
                                rib_assure_id: 1
                            })}>
                                Fournir le RIB
                            </Button>
                        )}

                        {dossier.status === 'REGLEMENT_REALISE' && (
                            <Button mode="contained" onPress={() => handleNextStep('CLOS')}>
                                Clôturer le dossier
                            </Button>
                        )}
                    </View>

                    <Divider style={styles.divider} />
                    
                    <List.Section>
                        <List.Subheader>Récapitulatif</List.Subheader>
                        <List.Item title="Scénario" description={dossier.scenario_type || 'Non défini'} />
                        {dossier.date_expertise_planifiee && (
                            <List.Item title="Expertise planifiée" description={new Date(dossier.date_expertise_planifiee).toLocaleDateString()} />
                        )}
                    </List.Section>
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
    chip: {
        marginRight: 10
    },
    divider: {
        marginVertical: 15
    },
    actionSection: {
        marginVertical: 10,
        gap: 10
    }
})
