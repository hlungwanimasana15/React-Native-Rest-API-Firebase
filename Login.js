import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = async () => {
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const user = {
      email,
      password,
      returnSecureToken: true,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
        <Text style={styles.header} >Sign In</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
        </View>
        <View>
        <Text>Don't have an account ? please signUp</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("register")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: "80%",
   
  },
  input: {
    backgroundColor: "#ecf0f1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    height:'20%'
  },
  buttonContainer: {
    width: "50%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#3498db",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    margin: 5,
    borderColor: "#078f9",
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    fontWeight: "700",
    fontSize: 16,
   
    marginTop: 10,
 
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
});
