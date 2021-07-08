import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Realm from 'realm';


export default function App() {
    const [realm, setRealm] = React.useState(null);

    React.useEffect(() => {

        //open the realm database connection
        Realm.open({
            //define the schema. 
            schema: [{ name: 'Dog', properties: { name: 'string' } }]
        }).then(realm => {
            realm.write(() => {
                //here we create a new Realm "Dog" object as if it was a class
                realm.create('Dog', { name: 'Rex' });
            });
            //here we update state with the data from Realm
            setRealm(realm);
        });
    }, []);

    const info = realm
        ? 'Number of dogs in this Realm: ' + realm.objects('Dog').length
        : 'Loading...';

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                {info}
            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    welcome: {
        fontSize: 24,
    }
})