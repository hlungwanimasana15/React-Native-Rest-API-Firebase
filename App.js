
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Homescreen from './Homescreen';
import Registration from './Registration';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="register" component={Registration} />
        <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="home" component={Homescreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
