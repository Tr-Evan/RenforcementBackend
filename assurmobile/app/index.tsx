import { ScrollView, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Redirect, useRootNavigationState, useRouter } from "expo-router"
import { Button, Card, Text, Divider, Chip } from "react-native-paper";
import { UserContext } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";

type SinistreType = {
  id: number | string,
  reference: string,
  immatriculation?: string,
  date_accident?: any,
  contexte?: string,
  status_validation: string
}

type DossierType = {
  id: number | string,
  num_dossier: string,
  status: string,
  is_clos: boolean
}

export default function Index() {
  const router = useRouter()
  const [ sinistres, setSinistres ] = useState<SinistreType[]>([]);
  const [ dossiers, setDossiers ] = useState<DossierType[]>([]);
  const rootNavigationState = useRootNavigationState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchData('/sinistres', 'GET', {}, true)
        .then(res => {
          if (res.success) setSinistres(res.data);
        })
        .catch(err => console.log('Error loading sinistres', err));

      fetchData('/dossiers', 'GET', {}, true)
        .then(res => {
          if (res.success) setDossiers(res.data);
        })
        .catch(err => console.log('Error loading dossiers', err));
    }
  }, [user])

  if (!user) {
    return <Redirect href="/login" />
  }

  if(!rootNavigationState?.key) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tableau de Bord</Text>
      
      <Text style={styles.sectionTitle}>Mes Dossiers en cours</Text>
      {dossiers.length === 0 && <Text style={styles.emptyText}>Aucun dossier en cours</Text>}
      {dossiers.map((dossier) => (
        <Card key={dossier.id} style={styles.dossierCard}>
          <Card.Title 
            title={"Dossier " + dossier.num_dossier} 
            right={() => <Chip style={styles.chip}>{dossier.status}</Chip>}
          />
          <Card.Actions>
            <Button onPress={() => router.push({ pathname: '/dossier/[id]', params: { id: dossier.id }})}>
              Suivre le dossier
            </Button>
          </Card.Actions>
        </Card>
      ))}

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Mes Sinistres</Text>
      {sinistres.length === 0 && <Text style={styles.emptyText}>Aucun sinistre déclaré</Text>}
      {sinistres.map((sinistre) => (
        <Card key={sinistre.id} style={styles.sinistreCard}>
          <Card.Title 
            title={"Sinistre " + sinistre.reference} 
            subtitle={sinistre.immatriculation}
            right={() => <Chip>{sinistre.status_validation}</Chip>}
          />
          <Card.Content>
            <Text variant="bodyMedium">Date : {new Date(sinistre.date_accident).toLocaleDateString()}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push({ pathname: '/sinistre/[id]', params: { id: sinistre.id }})}>
              Détails
            </Button>
          </Card.Actions>
        </Card>
      ))}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f2f5'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#1a73e8',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    color: '#444'
  },
  dossierCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#34a853'
  },
  sinistreCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#fbbc04'
  },
  divider: {
    marginVertical: 20
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginVertical: 10
  },
  chip: {
    marginRight: 10,
    fontSize: 10
  }
})
