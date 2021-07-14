import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons'

import MusicFlatList from './MusicFlatList';
import MusicData from './MusicData'

class MainScreen extends Component{

    constructor(props){
        super(props);

        this.state = {MusicData : MusicData, listId : null, itemId : null};
    }

    handleClosePlayingScreenIconClicked(){
        this.props.navigation.goBack();
    }

    handleLoveIconClicked = (favoriteSong) => {
        if(favoriteSong){
            let musicFavoriteList;
            let newMusicList;

            musicFavoriteList = this.state.MusicData.find(element => element.key === 1);
            newMusicList = musicFavoriteList.musicList.filter(element => element.key != this.state.itemId);
            musicFavoriteList.musicList = newMusicList;

            this.setState({MusicData})
        }
        else{
            let musicData;
            let musicFavoriteItem;
            let musicFavoriteList;
        
            musicData = this.state.MusicData.find(element => element.key === 0);
            musicFavoriteItem = musicData.musicList.find(element => element.key === this.state.itemId);

            musicFavoriteList = this.state.MusicData.find(element => element.key === 1);
            musicFavoriteList.musicList.push(musicFavoriteItem);

            this.setState({MusicData})
        }
    }

    checkMusicItemIsFavoriteSong = (itemId) => {
        let musicData;
        let musicFavoriteItem;

        musicData = this.state.MusicData.find(element => element.key === 1);
        musicFavoriteItem = musicData.musicList.find(element => element.key === itemId);

        return !musicFavoriteItem ? false : true;
    }

    getPreviousMusicItem = () => {
        let musicData;
        let currentMusicItemIndex = 0;

        musicData = this.state.MusicData.find(element => element.key === this.state.listId);
        
        for (let element of musicData.musicList){
            if (element.key === this.state.itemId){
                if (currentMusicItemIndex === 0){
                    return musicData.musicList[(musicData.musicList.length - 1)];
                }
                return musicData.musicList[currentMusicItemIndex-1];
            }
            currentMusicItemIndex += 1;
        }
    }

    getNextMusicItem = () => {
        let musicData;
        let currentMusicItemIndex = 0;

        musicData = this.state.MusicData.find(element => element.key === this.state.listId);
        
        for (let element of musicData.musicList){
            if (element.key === this.state.itemId){
                if (currentMusicItemIndex === (musicData.musicList.length - 1)){
                    return musicData.musicList[0];
                }
                return musicData.musicList[currentMusicItemIndex + 1];
            }
            currentMusicItemIndex += 1;
        }
    }

    handleBackwardIconClicked = () => {
        let previousMusicItem = this.getPreviousMusicItem();
        //Chua setState ngay lap tuc
        this.setState({itemId : previousMusicItem.key});
        
        let { navigate } = this.props.navigation;
        navigate("Playing", {
            songName: previousMusicItem.songName,
            singerName: previousMusicItem.singerName,
            imgName: previousMusicItem.imgName,
            musicFile: previousMusicItem.musicFile,
            favoriteSong : this.checkMusicItemIsFavoriteSong(previousMusicItem.key),
            listId : this.state.listId,
            itemId : previousMusicItem.key,
            onClosePlayingScreenIconClicked : () => this.handleClosePlayingScreenIconClicked(),
            onLoveIconClicked : this.handleLoveIconClicked,
            onForwardIconClicked : () => this.handleForwardIconClicked(),
            onBackwardIconClicked : () => this.handleBackwardIconClicked()
        });
    }

    handleForwardIconClicked = () => {
        let nextMusicItem = this.getNextMusicItem();
        //Chua setState ngay lap tuc
        this.setState({itemId : nextMusicItem.key});

        let { navigate } = this.props.navigation;
        navigate("Playing", {
            songName: nextMusicItem.songName,
            singerName: nextMusicItem.singerName,
            imgName: nextMusicItem.imgName,
            musicFile: nextMusicItem.musicFile,
            favoriteSong : this.checkMusicItemIsFavoriteSong(nextMusicItem.key),
            listId : this.state.listId,
            itemId : nextMusicItem.key,
            onClosePlayingScreenIconClicked : () => this.handleClosePlayingScreenIconClicked(),
            onLoveIconClicked : this.handleLoveIconClicked,
            onForwardIconClicked : () => this.handleForwardIconClicked(),
            onBackwardIconClicked : () => this.handleBackwardIconClicked()
        });
    }

    handleMusicItemClicked = (itemId, listId) => {
        let musicData;
        let musicItemClicked;
        
        musicData = this.state.MusicData.find(element => element.key === listId);

        musicItemClicked = musicData.musicList.find(element => element.key === itemId);

        this.setState({listId : listId, itemId : itemId});
        
        let { navigate } = this.props.navigation;
        navigate("Playing", {
            songName: musicItemClicked.songName,
            singerName: musicItemClicked.singerName,
            imgName: musicItemClicked.imgName,
            musicFile: musicItemClicked.musicFile,
            favoriteSong : this.checkMusicItemIsFavoriteSong(itemId),
            listId : listId,
            itemId : itemId,
            onClosePlayingScreenIconClicked : () => this.handleClosePlayingScreenIconClicked(),
            onLoveIconClicked : this.handleLoveIconClicked,
            onForwardIconClicked : () => this.handleForwardIconClicked(),
            onBackwardIconClicked : () => this.handleBackwardIconClicked()
        });
    }

    render(){
        return (
                <LinearGradient
                    colors={["#53AFFF", "#E0E5FF"]}
                    style={this.styles.gradientBackground}>

                    <StatusBar hidden={true}/>
                    <ScrollView
                    
                        showsVerticalScrollIndicator = {false}>

                        <TouchableOpacity style={this.styles.addPlayListContainer}>
                            <Feather name="headphones" size={35} color="#1B4965"></Feather>
                            <Text style={this.styles.titleText}>Digital Music</Text>
                        </TouchableOpacity>

                        { 
                            this.state.MusicData.map(MusicDataItem => (
                                <View key={MusicDataItem.key}>
                                    <Text style={this.styles.titleText}>{MusicDataItem.titleName}</Text>
                                    <MusicFlatList
                                        data = {MusicDataItem.musicList}
                                        onMusicItemClicked = {this.handleMusicItemClicked}
                                        listId = {MusicDataItem.key}
                                    />
                                </View>
                            ))
                        }

                    </ScrollView>
                </LinearGradient>
        )
    }

    styles = StyleSheet.create({
        gradientBackground:{
            flex: 1,
        },

        addPlayListContainer:{
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 25,
        },
    
        titleText:{
            fontWeight: "bold",
            fontSize: 20
        },
    
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

export default MainScreen;