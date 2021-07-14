import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import PlayingScreen from './PlayingScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons'


class TabNavigation extends Component{

    Tab = createBottomTabNavigator();

    render(){
        return(
            <NavigationContainer>

                <this.Tab.Navigator>

                    <this.Tab.Screen name="Playlist" component={MainScreen} 
                        options={{
                            tabBarLabel: 'Playlist',
                            tabBarIcon: ({color, size})=>(
                                <MaterialCommunityIcons name="playlist-music" size={size} color={color}/>
                            ),
                        }}/>

                    <this.Tab.Screen name="Playing" component={PlayingScreen}
                        options={{
                            tabBarLabel: 'Playing',
                            tabBarIcon: ({color, size})=>(
                                <MaterialCommunityIcons name="disc-player" size={size} color={color}/>
                            ),
                        }}/>

                </this.Tab.Navigator>

            </NavigationContainer>
        )
    }
}

export default TabNavigation;