import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react';
import { StyleSheet, Text, View,TextInput,Image,Dimensions } from 'react-native';
import {apiCall} from './assets/js/apiCall';
import { FlatList} from 'react-native-gesture-handler';
import {colors} from './assets/js/colors';
import {contains} from './assets/js/filter';


export default function App() {
  const [stock,setStock]= useState([]);
  const [allStock, setAllStock] = useState([]);
  const [numColumns,setNumColumns]= useState(2);


  const loadBeers = async()=>{
    
    await apiCall("stock").then(data=>{
      setStock(data);
      setAllStock(data);
      
  });
 
  }
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
  
    return data;
  };
  
  const renderItem = ({item})=>{
    if (item.empty === true) {
        return <View style={{...styles.item, ...styles.itemInvisible}} />;
      }
    return <Beer beer={item} key={item._id}/>
  }
  const Beer = (props)=>{
         
      return(
        <View style={styles.item} >
          <View style={{backgroundColor:colors.tertiary,margin:2,padding:5,flex:1,flexDirection:"row"}}>
              
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <Image style={styles.image} source={{uri:props.beer.beer_img}}/>
              </View>
              <View style={{flex:2,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"white",paddingTop:6,paddingBottom:6}}>{props.beer.beer_name}</Text>
                <Text style={{color:"white",paddingBottom:6}}>{props.beer.beer_percentage}</Text>
                
                <Text style={{color:"white"}}>{props.beer.beer_type}</Text>
                <Text style={{color:"white"}}>{props.beer.expirationDate}</Text>
               
              </View>
  
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
              <Text style={{color:"white",fontSize:30}}>{props.beer.stock}</Text>
              </View>
          </View>
          </View>
      )
  }


  
 

const handleSearch = (text)=>{
  const formatQuery = text.toLowerCase();
  setStock(contains(allStock,formatQuery));
}
  useEffect(()=>{
    
   (async()=>{await loadBeers()})();
 
  },[])

  Dimensions.addEventListener("change",({window:{width,height}})=>{if(width<height){setNumColumns(2); }else{setNumColumns(3)}})
  return (
    <View style={styles.container}>
    <StatusBar hidden={true}/>
    <FlatList key={numColumns} ListHeaderComponent={<TextInput style={{height: 40 ,padding: 10,margin:2, backgroundColor:"white"}} clearButtonMode="always"  placeholder="Search"  onChangeText={text=>handleSearch(text)} />}   data={formatData(stock,numColumns)} renderItem={renderItem} keyExtractor={(item)=>{return item._id}} numColumns={numColumns} />
</View>
  );
}

const styles = StyleSheet.create({
    container: {
        
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'stretch',
        justifyContent: 'center',
        padding:5
        
      },
      image:{
          width:70,height:70,resizeMode:'contain'
      },
      
      itemInvisible: {
        backgroundColor: 'transparent',
      },item: {
        backgroundColor: colors.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin:3
       
        
       
      },
      
  });