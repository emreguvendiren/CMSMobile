import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import {getRequest} from '../services/apiService';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTables();
  }, [isFocused]);

  const fetchTables = () => {
    getRequest(
      'table/getAllTableWithPrice',
      responseData => {
        console.log(responseData.result);

        setTables(responseData.result);
      },
      err => {
        console.error(err);
      },
    );
  };

  const handleTableClick = table => {
    //setSelectedTable(table);
    //setModalVisible(true);
    navigation.navigate('TableDetail', {
      tableId: table.id,
      tableName: table.tableName,
    });
  };

  const renderTableItem = ({item}) => (
    <TouchableOpacity onPress={() => handleTableClick(item)}>
      <Card
        style={[styles.card, item.price > 0 && {backgroundColor: 'orange'}]}>
        <Card.Content>
          <Title style={styles.title}>Masa {item.tableName}</Title>
          <Paragraph style={styles.price}>Fiyat: {item.price} TL</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tables}
        renderItem={renderTableItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {selectedTable ? `Masa ${selectedTable.tableName}` : ''}
          </Text>
          <Button onPress={() => setModalVisible(false)} title="Kapat" />
        </View>
      </Modal>
    </View>
  );
};

const cardWidth = (windowWidth - 40) / 3 - 5;
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    marginTop: 5,
    fontSize: 12,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Tables;
