import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Button, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getRequest } from '../services/apiService';
import { Card, Paragraph, Title } from 'react-native-paper';
import { Typography } from '@mui/material';


const windowWidth = Dimensions.get('window').width;

const TableDetail = ({ route, navigation }) => {
    const { tableId } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [products,setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory,setSelectedCategory] = useState();


    const handleAddProduct = async()=>{
        setModalVisible(true)
    }

    useEffect(()=>{
        getRequest("category/getAllCategory",(responseData)=>{
            if(responseData.status===200){

                setCategories(responseData.result);
                setSelectedCategory(responseData.result[0])
                getProductByCategory(responseData.result[0])
                
            }
        });
    },[]);

    const getProductByCategory =async (e) =>{

        setSelectedCategory(e)

        getRequest("product/getProductsByCategory?categoryId="+ e.id,(responseData)=>{
            if(responseData.status === 200){
                setProducts(responseData.result)
            }
            else{
                setProducts([])
            }
        })
    }

    const renderProductItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.contentStyle}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 100, height: 100,borderRadius:20 }}
                    resizeMode={"cover"}
                />
                <View style={styles.textContainer}>
                    <Title style={styles.title}>{item.name}</Title>
                    <Paragraph style={styles.price}>Fiyat: {item.price} TL</Paragraph>
                    <Paragraph style={styles.price}>{item.description}</Paragraph>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={{flex:1}}>
            <View style={styles.container}>
            <Text style={styles.title}>Masa ID: {tableId}</Text>
            <Button title="Geri Dön" onPress={() => navigation.goBack()} />
        </View>

            <TouchableOpacity onPress={handleAddProduct} style={styles.addProduct}>
                <Icon name="order-bool-ascending" size={28} color={'red'} />
            </TouchableOpacity>


            <Modal
               transparent={true}
               visible={modalVisible}
               animationType="slide"
               onRequestClose={() => setModalVisible(false)}
               >
                   <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <View style={styles.menu}>
                            <FlatList
                                horizontal
                                data={categories}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => getProductByCategory(item)}>
                                        <Text style={[
                                            styles.menuItem,
                                            item === selectedCategory && styles.selectedMenuItem
                                        ]}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                        <View style={{ marginTop: 15 ,flex:0.9}}>
                            {
                                products.length>0&&
                                    <FlatList
                                    data={products}
                                    renderItem={renderProductItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    contentContainerStyle={styles.list}
                                />
                            }
                            {
                                products.length===0&&
                                    <Text>Ürün Bulunamadı</Text>
                            }
                        </View>
                        <TouchableOpacity style={styles.closeButtonContainer} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

const cardWidth = windowWidth - 92; 
const horizontalSpacing = 10;

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
    addProduct: {
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        height: '90%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
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
    list: {
        paddingHorizontal: 10,
        paddingBottom: 60,
    },
    menuItem: {
        marginHorizontal: 20,
        paddingVertical: 5,
        fontSize: 16,
        color: '#333',
        fontWeight: "bold"
    },
    card: {
        width: cardWidth,
        marginLeft:-3,
        marginVertical: 12,
        marginRight: horizontalSpacing,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    menu: {
        flexDirection: 'row',
        //backgroundColor: '#f5f5f5',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#C7B7A3"
    },
    price: {
        marginTop: 2,
        fontSize: 12,
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
    },
    selectedMenuItem: {
        color: '#FF6347',
        borderBottomWidth: 2,
        borderBottomColor: '#FF6347',
    },
    closeButtonContainer: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 0,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
    },
});
export default TableDetail;
