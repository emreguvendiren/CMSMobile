import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View ,Image, TouchableHighlight, TouchableOpacity} from "react-native";
import { Card, Paragraph, Text, Title } from "react-native-paper";
import { getRequest } from "../services/apiService";
import { CardMedia } from "@mui/material";


const windowWidth = Dimensions.get('window').width;
const Menu = () =>{
    const isFocused = useIsFocused();
    const [products,setProducts] = useState([]);

    useEffect(()=>{
        getRequest("product/getAllProduct",(responseData)=>{
            if(responseData.status===200){
                setProducts(responseData.result);
                
            }
        });
    },[isFocused]);


    const renderTableItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.contentStyle}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 100, height: 100 }}
                />
                <View style={styles.textContainer}>
                    <Title style={styles.title}>{item.name}</Title>
                    <Paragraph style={styles.price}>Fiyat: {item.price} TL</Paragraph>
                    <Paragraph style={styles.price}>{item.description}</Paragraph>
                </View>
            </Card.Content>
        </Card>
    );
    return(
        <View style={styles.container}>
           <FlatList
                data={products}
                renderItem={renderTableItem}
                keyExtractor={(item) => item.id.toString()}
                
                contentContainerStyle={styles.list}
            />
        </View>
    );

};

const cardWidth = (windowWidth - 40) / 1 - 20;
const horizontalSpacing = 10; // Yatay boşluk

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    list: {
        paddingHorizontal: 10, // Sağdan ve soldan eşit uzaklık için
    },
    card: {
        width: cardWidth,
        marginVertical: 10,
        marginRight: horizontalSpacing, // Sağdan boşluk eklendi
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    price: {
        marginTop: 2,
        fontSize: 12,
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start', // İçeriği üstten hizalayacak
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
        marginTop: -10, // Metni biraz yukarı kaydırmak için
    },
});

export default Menu;