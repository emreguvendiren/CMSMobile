import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, ToastAndroid, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Button, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getRequest, postRequest } from '../services/apiService';
import { Card, DataTable, Paragraph, Title } from 'react-native-paper';
import { Typography } from '@mui/material';
import { useScrollToTop } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;



const TableDetail = ({ route, navigation }) => {

    const defaultValue = {
        tableId:null,
        productId:null,
        totalPrice:null,
        quantity:null
    }

    const { tableId } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [products,setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory,setSelectedCategory] = useState();
    const [orders,setOrders] = useState([]);
    const [selectedProducts,setSelectedProducts] = useState([]);

    const increment =(item)=>{
        
        const newData = products.map(row=>{
            if(row.id===item.id){
                return {...row,quantity:row.quantity+1};
            }
            return row;
        })
        
        const hasItem  = selectedProducts.findIndex(row=>row.id===item.id);

        if(hasItem>-1){
            const newProduct = selectedProducts.map(rowItem=>{
                if(rowItem.id==item.id){
                    return {...rowItem,quantity:item.quantity+1}
                }
                return rowItem;

            })
            setSelectedProducts(newProduct);
        }
        else{
            
            const newItem = {...item,quantity:1};
            setSelectedProducts([...selectedProducts,newItem])
        }

        setProducts(newData);
    };

    const decrement =(item)=>{
        
        const newData = products.map(row=>{
            if(row.id===item.id){
                if(item.quantity>0){
                    return {...row,quantity:row.quantity-1};
                }
            }
            return row;
        })
        const newProduct = selectedProducts.map(rowItem=>{
            if(rowItem.id==item.id){
                if(item.quantity>0){
                    return {...rowItem,quantity:item.quantity-1}
                }
            }
            return rowItem;

        })
        setSelectedProducts(newProduct);
        setProducts(newData);
    };

    

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


                const newData = responseData.result.map(item=>{
                    const newQuantity = selectedProducts.filter(row=>row.id===item.id && row.quantity>0);
                    if(newQuantity.length>0){
                        return {...item,quantity:newQuantity[0].quantity}    
                    }
                    else{
                        return {...item,quantity:0}
                    }
                    
                });
                setProducts(newData);
            }
            else{
                setProducts([])
            }
        })
    }

    const handleAddOrder = async()=>{
        if(orders.length===0){
            ToastAndroid.show("Lutfen Urun Ekleyiniz",ToastAndroid.LONG)
        }
        else{
            const data = []
            orders.map(item=>{
                data.push( {...defaultValue,totalPrice:item.totalPrice,quantity:item.quantity,tableId:tableId,productId:item.id});
            })
            console.log(data)
            postRequest("orders/create",data,(responseData)=>{
                if(responseData.status===200){

                }
                else{
                    
                }
                ToastAndroid.show(responseData.message,ToastAndroid.LONG)
            })
        }
    }

    const handleAddButton = async()=>{
        let data = selectedProducts.filter(x=>x.quantity !=0);
        data = data.map(row=>{
            return {...row,totalPrice:row.quantity*row.price};
        })
        setOrders(data);
        setModalVisible(false);

        //deneme
        // const newData = {
        //     id:null,
        //     quantity:null
        // }
        // const asd = selectedProducts.map(item=>{
        //     return {...newData,id:item.id,quantity:item.quantity}
        // })
        // console.log(asd)
    }

    const renderProductItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.contentStyle}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 80, height: 80,borderRadius:20 }}
                    resizeMode={"cover"}
                />
                <View style={styles.textContainer}>
                    <Title style={styles.title}>{item.name}</Title>
                    <Paragraph style={styles.price}>Fiyat: {item.price} TL</Paragraph>
                    <Paragraph style={styles.description}>{item.description} </Paragraph>
                </View>

                <View style={styles.containerDecInc}>
                    <TouchableOpacity onPress={()=>{increment(item)}} style={styles.buttonDecInc}>
                        <Icon name="plus-thick" size={23} color={'orange'} />
                    </TouchableOpacity>
                    <View style={styles.countContainer}>
                        <Text style={styles.countText}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{decrement(item)}} style={styles.buttonDecInc}>
                        <Icon name="minus-thick" size={23} color={'orange'} />
                    </TouchableOpacity>
                </View>

            </Card.Content>
        </Card>
    );

    return (
        <View style={{flex:1}}>
            <View style={styles.container}>
            <Text style={styles.title}>Masa ID: {tableId}</Text>
            {
            <DataTable >
            <DataTable.Header>
                <DataTable.Title>Ürün Adı</DataTable.Title>
                <DataTable.Title>Fiyat</DataTable.Title>
                <DataTable.Title>Adet</DataTable.Title>
                <DataTable.Title>Toplam Fiyat</DataTable.Title>
            </DataTable.Header>
            {
                orders.length>0&&
                    orders.map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell>{item.price}</DataTable.Cell>
                            <DataTable.Cell >{item.quantity}</DataTable.Cell>
                            <DataTable.Cell >{item.totalPrice}</DataTable.Cell>
                        </DataTable.Row>
                    ))
            }

        </DataTable>
        }

        <View>
        <TouchableOpacity style={styles.addNewOrder} onPress={handleAddOrder}>
                            <Text style={styles.closeButtonText}>Siparis Olustur</Text>
                        </TouchableOpacity>
        </View>

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
                        <View style={{ marginTop: 15 ,flex:1}}>
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
                        <TouchableOpacity style={styles.closeButtonContainer} onPress={handleAddButton}>
                            <Text style={styles.closeButtonText}>Ekle</Text>
                        </TouchableOpacity>
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
       // flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerDecInc: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 5,
        borderWidth: 0.7,
        borderColor: '#ddd',
        
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
    description:{
        marginTop: 2,
        fontSize: 12,
        paddingRight:40
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

  

    addNewOrder: {
        
        width: '100%',
        paddingVertical: 7,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'relative',
        bottom: 0,
    },
    closeButtonContainer: {
        width: '100%',
        paddingVertical: 7,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'relative',
        bottom: 0,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    addProductToOrder:{
        position: 'absolute',
        bottom: 36,
        right: 10,
        borderRadius: 10,
        backgroundColor: '#f0ad4e',
        width: "15%",
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDecInc: {
        padding: 3,
      },
      countContainer: {
        marginHorizontal: 10,
        backgroundColor: '#ffecd2',
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 3,
      },
      countText: {
        fontSize: 14,
        color: 'orange',
        textAlign: 'center',
      }
});
export default TableDetail;