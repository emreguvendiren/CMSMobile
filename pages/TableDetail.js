import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Button, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TableDetail = ({ route, navigation }) => {
    const { tableId } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    


    const handleAddProduct = async()=>{
        setModalVisible(true)
    }


    return (
        <View style={{flexDirection:'column',display:'flex',flex:1}}>
            <View style={styles.container}>
            <Text style={styles.title}>Masa ID: {tableId}</Text>
            <Button title="Geri Dön" onPress={() => navigation.goBack()} />
        </View>

            <TouchableOpacity onPress={handleAddProduct}>
            <View style={styles.addProduct}>

                <Icon name="order-bool-ascending" size={28} color={'red'} />

            </View>
            </TouchableOpacity>


            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                       
                    </Text>
                    <Button onPress={() => setModalVisible(false)} title="Kapat" />
                </View>
            </Modal>


        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 0.98,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addProduct:{
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 30,
        backgroundColor: 'orange',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addProductText: {
        fontSize: 30,
        color: 'white',
    },
    modalView: {
        height: '90%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"

}
});

export default TableDetail;
