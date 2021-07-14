import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av';

class PlayingScreen extends Component{

    soundObject = null;
    soundLoaded = false;

    sliderAndCounterInterval = null;

    constructor(props){
        super(props);

        if (!this.props.route.params){
            this.state = {
                favoriteSong : null,
                currentValue : 0, 
                maximumValue : 1, 
                processDuration : '0:00', 
                totalDuration : '0:00', 
                soundPlaying : false, 
                soundLoadedNotPlaying : true,
                invertColor : false,
                soundReplay : false,
                listId : null,
                id : null
            };
        }
        else{
            this.state = {
                favoriteSong : this.props.route.params.favoriteSong,
                currentValue : 0, 
                maximumValue : 1, 
                processDuration : '0:00', 
                totalDuration : '0:00', 
                soundPlaying : false,
                soundLoadedNotPlaying : true,
                invertColorMode : false,
                soundReplay : false,
                listId : this.props.route.params.listId,
                id : this.props.route.params.itemId
            };
        }

        this.loadMusic();
    }

    millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis/60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds)
    }

    clearSliderAndCounterInterval = () => {
        clearInterval(this.sliderAndCounterInterval);
        this.setState({soundPlaying : false})
    }
    
    setSliderAndCounterInterval = () => {
        this.sliderAndCounterInterval = setInterval (() => {
            this.setState({currentValue : this.state.currentValue + 100})
            this.setState({processDuration : this.millisToMinutesAndSeconds(this.state.currentValue)})

            if (this.state.currentValue >= this.state.maximumValue) {

                if(this.state.soundReplay){
                    this.setState({
                        currentValue : 0, 
                        processDuration : '0:00'
                    })
                }

                else{
                    this.clearSliderAndCounterInterval()

                    this.setState({
                        currentValue : 0, 
                        processDuration : '0:00', 
                        soundPlaying : false,
                    });
                }
            }
        }, 100);
    }

    loadMusic = async() => {
        if (this.props.route.params != null){
            this.soundObject = new Audio.Sound();
            await this.soundObject.loadAsync(require('../musics/'+this.props.route.params.musicFile)).then(
            this.soundLoaded = true
            );
        }
    }

    getPlayIconClassName = () => {
        if (this.state.soundPlaying){
            return "pause";
        }
        else{
            return "play";
        }
    }
    
    handlePlayIconePress = async() => {
        
        if (this.soundLoaded){

            if(this.state.soundLoadedNotPlaying){

                await this.soundObject.playAsync();

                let durationMillis = 0
    
                await this.soundObject.getStatusAsync().then(
                    function(result){
                        durationMillis = result.durationMillis
                    }
                );
    
                this.setState({soundLoadedNotPlaying : false});
                this.setState({maximumValue : durationMillis});
                this.setState({totalDuration : this.millisToMinutesAndSeconds(this.state.maximumValue)});
                this.setState({soundPlaying : true})
    
                this.setSliderAndCounterInterval();

            }

            else{

                if (this.state.soundPlaying){
                    await this.soundObject.pauseAsync();
                    
                    this.clearSliderAndCounterInterval();

                    this.setState({soundPlaying : false})

                }

                else{
                    await this.soundObject.playAsync();

                    this.setSliderAndCounterInterval();

                    this.setState({soundPlaying : true})
                }
            }

        }
    }

    handleSlidingComplete = (value) => {
        if(this.soundLoaded && this.state.soundLoadedNotPlaying === false){
            this.soundObject.setPositionAsync(value);
            this.setState({currentValue : value})

            this.soundObject.playAsync();
            this.setState({soundPlaying : true});

            this.setSliderAndCounterInterval();
        }
    }

    handleSlidingStart = () => {
        if(this.soundLoaded){
            this.soundObject.pauseAsync();
            this.setState({soundPlaying : false});

            this.clearSliderAndCounterInterval();
        }
    }

    getLoveIconClassName = () => {
        if (this.state.favoriteSong){
            return "md-heart";
        }
        else{
            return "md-heart-empty";
        }
    }

    handleInvertColorButtonPress = () => {
        if (this.state.invertColorMode){
            this.setState({invertColorMode : false,})
        }
        else{
            this.setState({invertColorMode : true})
        }
    }

    handleReplayButtonPress = () => {
        if (this.state.soundReplay){
            this.setState({soundReplay : false});
            this.soundObject.setIsLoopingAsync(false);
        }
        else{
            this.setState({soundReplay : true});
            this.soundObject.setIsLoopingAsync(true);
        }
    }

    getColorActivedInvertColorButton = () => {
        if(this.state.invertColorMode){
            return "#53AFFF";
        }
        return "#1B4965";
    }

    getColorActivedReplayButton = () => {
        if(this.state.soundReplay){
            return "#53AFFF";
        }
        return "#1B4965";
    }

    handleLoveIconPress = () => {
        if (this.state.favoriteSong){
            this.setState({favoriteSong : false});
            this.props.route.params.onLoveIconClicked(this.state.favoriteSong);
        }
        else{
            this.setState({favoriteSong : true});
            this.props.route.params.onLoveIconClicked(this.state.favoriteSong);
        }
    }

    componentDidUpdate(){
        if (this.props.route.params != null){
            if (this.state.id != this.props.route.params.itemId || this.state.listId != this.props.route.params.listId){
                if(this.soundObject != null){
                    this.soundObject.unloadAsync();
                }

                this.clearSliderAndCounterInterval();

                this.loadMusic();

                this.setState({
                    favoriteSong : this.props.route.params.favoriteSong,
                    currentValue : 0, 
                    maximumValue : 1,
                    processDuration : '0:00', 
                    totalDuration : '0:00',
                    soundPlaying : false,
                    soundLoadedNotPlaying : true,
                    listId : this.props.route.params.listId,
                    id : this.props.route.params.itemId
                });
            }
        }
    }

    render(){
        if (!this.props.route.params){
            return (
            <LinearGradient 
                colors={["#53AFFF", "#E0E5FF"]}
                style={this.styles.gradientBackground}>
                <StatusBar hidden={true}/>

                <View style={this.styles.greetingContainer}>
                    <FontAwesome5 name="smile-wink" size={24} color="black"/>
                    <Text>Pick a song then enjoy with us!</Text>
                </View>

            </LinearGradient>
            )
        };
        return (
            <LinearGradient 
                colors={[this.state.invertColorMode ? "#30719C" : "#53AFFF", this.state.invertColorMode ? "#310208" : "#E0E5FF"]}
                style={this.styles.gradientBackground}>

                <StatusBar hidden={true}/>

                <View style={this.styles.headerContainer}>
                    <TouchableOpacity
                        onPress={this.props.route.params.onClosePlayingScreenIconClicked}>

                        <Ionicons name="md-close" size={35} color="#1B4965"></Ionicons>

                    </TouchableOpacity>

                    <View style={this.styles.songInformationContainer}>
                        <Text numberOfLines={1} style={this.styles.songName}>{this.props.route.params.songName}</Text>
                        <Text numberOfLines={1} style={this.styles.singerName}>{this.props.route.params.singerName}</Text>
                    </View>

                    <TouchableOpacity onPress={this.handleLoveIconPress}>
                        <Ionicons name={this.getLoveIconClassName()} size={35} color="#1B4965"></Ionicons>
                    </TouchableOpacity>

                </View>

                <Image style={this.styles.posterImage} source={ require("../posters/" + this.props.route.params.imgName) }/>

                <View style={this.styles.sliderContainer}>

                    <Slider style={this.styles.sliderStyle}
                        minimumValue={0}
                        maximumValue={this.state.maximumValue}
                        value={this.state.currentValue}
                        minimumTrackTintColor="#53AFFF"
                        maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                        thumbTintColor="#FFFFFF"
                        onSlidingStart={this.handleSlidingStart}
                        onSlidingComplete={this.handleSlidingComplete}/>

                    <View style={this.styles.durationTextContainer}>
                        <Text style={this.styles.processDurationText}>{this.state.processDuration}</Text>
                        <Text style={this.styles.totalDurationText}>{this.state.totalDuration}</Text>
                    </View>

                </View>

                <View style={this.styles.controlContainer}>

                    <TouchableOpacity onPress={this.handleInvertColorButtonPress}>
                        <MaterialCommunityIcons name="invert-colors" size={22} color={this.getColorActivedInvertColorButton()} style={this.styles.invertColorButton}></MaterialCommunityIcons>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this.props.route.params.onBackwardIconClicked()}>
                        <FontAwesome5 name="step-backward" size={25} color="#1B4965" style={this.styles.backwardButton}></FontAwesome5>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.handlePlayIconePress} style={this.styles.playButtonContainer}>
                        <FontAwesome5 name={this.getPlayIconClassName()} size={20} color="#1B4965" style={this.styles.playButton}></FontAwesome5>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.route.params.onForwardIconClicked}>
                        <FontAwesome5 name="step-forward" size={25} color="#1B4965"style={this.styles.forwardButton}></FontAwesome5>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.handleReplayButtonPress}>
                        <FontAwesome5 name="retweet" size={20} color={this.getColorActivedReplayButton()} style={this.styles.replayButton}></FontAwesome5>
                    </TouchableOpacity>

                </View>

            </LinearGradient>
        );
    }

    styles = StyleSheet.create({
        gradientBackground:{
            flex: 1,
            flexDirection: "column",
            alignItems: "center"
        },

        greetingContainer:{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },

        headerContainer:{
            width: "95%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
        },

        songInformationContainer:{
            flexDirection: "column",
            alignItems: "center"
        },
    
        posterImage:{
            position: "relative",
            width: Dimensions.get("screen").width/2 + Dimensions.get("screen").width/3,
            height: Dimensions.get("screen").width/2 + Dimensions.get("screen").width/3,
            resizeMode: "contain"
        },
    
        songName:{
            fontSize: 25,
        },
    
        singerName:{
            fontSize: 15,
        },
    
        sliderContainer:{
            width: "100%",
            alignItems: "center",
            marginVertical: Dimensions.get("screen").width/10,
        },
    
        sliderStyle:{
            width: Dimensions.get("screen").width/2 + Dimensions.get("screen").width/3,
        },
    
        controlContainer:{
            flexDirection: "row",
            alignItems: "center",
        },
    
        backwardButton:{
            marginEnd: Dimensions.get("screen").width/10
        },
    
        forwardButton:{
            marginStart: Dimensions.get("screen").width/10
        },
    
        playButtonContainer:{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            width: 64,
            height: 64,
            borderRadius: 32,
        },
    
        playButton:{
        },

        invertColorButton:{
            marginEnd: Dimensions.get("screen").width/10
        },

        replayButton:{
            marginStart: Dimensions.get("screen").width/10
        },

        durationTextContainer:{
            width: "80%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10
        },

        processDurationText:{
            //alignSelf: "flex-start",
            //flex: 0.5,
            //textAlign: "left",
            color: "#FFFFFF",
            backgroundColor: "#53AFFF",
            paddingHorizontal: 8,
            borderRadius: 4,
        },

        totalDurationText:{
            //flex: 0.5,
            //textAlign: "right",
            color: "#FFFFFF",
            backgroundColor: "#53AFFF",
            paddingHorizontal: 8,
            borderRadius: 4,
        }
    });
}

export default PlayingScreen;