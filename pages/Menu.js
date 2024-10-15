import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, Card, Paragraph, Text, Title } from "react-native-paper";
import { getRequest } from "../services/apiService";
import { setEnabled } from "react-native/Libraries/Performance/Systrace";

const windowWidth = Dimensions.get('window').width;

const Menu = () => {
    const isFocused = useIsFocused();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        getRequest("category/getAllCategory", (responseData) => {
            if (responseData.status === 200) {
                setCategories(responseData.result);
                setSelectedCategory(responseData.result[0]);
                getProductByCategory(responseData.result[0]);
            }
        });
    }, [isFocused]);

    const getProductByCategory = async (category) => {
        setIsLoading(true);
        setIsEnabled(false);
        setProducts([]);
        setSelectedCategory(category);

        getRequest("product/getProductsByCategory?categoryId=" + category.id, (responseData) => {
            if (responseData.status === 200) {
                setProducts(responseData.result);
                setIsLoading(false);
                setIsEnabled(true);
            }
            else{
                setIsEnabled(true);
            }
        });
    };

    const renderProductItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.contentStyle}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 100, height: 100, borderRadius: 20 }}
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
        <View style={styles.container}>
            <View style={styles.menu}>
                <FlatList
                    horizontal
                    data={categories}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity key={item.id} onPress={() => getProductByCategory(item)} disabled={!isEnabled}>
                            <Text style={[
                                styles.menuItem,
                                item === selectedCategory && styles.selectedMenuItem
                            ]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
            {isLoading &&
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,flex:1}}>
                    <ActivityIndicator size="large" color="#C7B7A3" />
                </View>

            }

            {
                isLoading === false &&
                <View style={{ marginTop: 15 }}>
                    <FlatList
                        data={products}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                    />
                </View>
            }

        </View>
    );
};

const cardWidth = (windowWidth - 40) / 1 - 20;
const horizontalSpacing = 10;

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    list: {
        paddingHorizontal: 10,
    },
    menuItem: {
        marginHorizontal: 20,
        paddingVertical: 5,
        fontSize: 16,
        color: '#333',
        fontWeight: "bold"
    },
    selectedMenuItem: {
        color: '#FF6347',
        borderBottomWidth: 2,
        borderBottomColor: '#FF6347',
    },
    card: {
        width: cardWidth,
        marginVertical: 10,
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
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    menu: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
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
        marginTop: -10, // Metni biraz yukarı kaydırmak için
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start', // İçeriği üstten hizalayacak
    }
});

export default Menu;
