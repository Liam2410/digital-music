import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

class MusicFlatList extends Component{
    
    constructor(props){
        super(props);
    }
    
    renderItem = ({item}) => {
        return(
            <TouchableOpacity
                onPress={() => this.props.onMusicItemClicked(item.key, this.props.listId)}>

                <View style={this.styles.itemFlatList}>
                    <Image style={this.styles.posterImage} source={ require("../posters/" + item.imgName) }/>
                    <Text numberOfLines={1} style={this.styles.songName}>{item.songName}</Text>
                    <Text numberOfLines={1} style={this.styles.singerName}>{item.singerName}</Text>
                </View>
                
            </TouchableOpacity>
        );
    };

    render(){
        return(
            <FlatList
                data = {this.props.data}
                renderItem = {this.renderItem}
                keyExtractor = {item => item.key}

                showsHorizontalScrollIndicator = {false}
                horizontal = {true}
                style = {this.styles.flatList} 
            />
        )
    }

    styles = StyleSheet.create({
        posterImage:{
            position: "relative",
            width: 80,
            height: 80,
            resizeMode: "contain"
        },
    
        songName:{
            fontSize: 10
        },
    
        singerName:{
            fontSize: 8
        },
    
        itemFlatList:{
            maxWidth: 80,
            marginHorizontal: 5
        },
    
        flatList:{
            marginBottom: 10
        }
    });
}

export default MusicFlatList;