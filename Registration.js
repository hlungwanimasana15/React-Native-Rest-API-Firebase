import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState ,useEffect} from 'react'
import { useNavigation } from '@react-navigation/core'


// const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";

const Registration = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    const handleSignUp =async () => {
        
        const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";
        const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
        const userInfo = {
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
                body: JSON.stringify(userInfo),
             })

             const data = await response.json()
             console.log(data);
             alert('successful ')
             navigation.navigate("Login")
             return data
        } catch (error) {
            console.log(error);
            
        }
    }

  

      useEffect(() => {
        
      }, [])  
    
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior='height'>
                 <Text style={styles.header} >Register</Text>
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
                    onPress={handleSignUp}
                    
                    style={[styles.button, styles.buttonOutline]}
                >
                <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    )
}

export default Registration

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      inputContainer: {
        width: '80%',
      },
      input: {
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height:60
      },
      buttonContainer: {
        width: '80%',
        marginTop: 20,
      },
      button: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
      },
      buttonOutline: {
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#3498db',
      },
      buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
      },
      buttonOutlineText: {
        color: '#3498db',
        fontWeight: '700',
        fontSize: 16,
      },
      header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', 
      },

})