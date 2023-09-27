import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState ,useEffect} from 'react'
import { useNavigation } from '@react-navigation/core'

const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

   

    const handleLogin = async () => {
        
        const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        const user = {
            email,
            password,
            returnSecureToken : true,
        }

        try {
             const response = await fetch(endpoint,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(user)
             })
             const data = await response.json()
             console.log(data);
             navigation.navigate("home")
        } catch (error) {
            console.log(error);
            
        }
        

      }

      useEffect(() => {
        
      }, [])  
    
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior='padding'>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                  
                    style={styles.input}
                ></TextInput>
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                   
                ></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                <Text style={styles.buttonOutlineText}>Login</Text>
                </TouchableOpacity>

                <Text>Don't have an account ? please signUp</Text>
                <TouchableOpacity
                    // onPress={ navigation.navigate("register")}
                    style={[styles.button, styles.buttonOutline]}
                >
                <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        
    },
    inputContainer: {
        width: '50%',
        marginTop:15,
        margin:40,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0783f9',
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    buttonOutline: {
        backgroundColor: 'white',
        margin: 5,
        borderColor: '#078f9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        fontWeight: '700',
        fontSize: 16,
       
    },

})