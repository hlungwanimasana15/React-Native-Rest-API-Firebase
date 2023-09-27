import { Button, View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';


const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";
const Homescreen = () => {

    const recordingSettings = {
        android: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };


    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [title, setTitle] = useState('');
    const [messege, setMessege] = useState("")
    const [editTitle, setEditTitle] = useState(-1)

    const navigation = useNavigation()

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    recordingSettings
                );
                setRecording(recording);

            } else {
                setMessege("please grant permission to app to access microphone");
            }
        } catch (err) {
            console.error('failed to start recording', err);
        }
    }

    async function stopRecording() {

        try {
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            const { sound, status } = await recording.createNewLoadedSoundAsync();

            const audioFile = await recording.getURI();

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    try {
                        resolve(xhr.response);
                        console.log(xhr.response);
                    } catch (error) {
                        console.log("error:", error);
                    }
                };
                xhr.onerror = (e) => {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", audioFile, true);
                xhr.send(null);
            });
            console.log('Time==', status)
            if (blob) {


                const projectId = 'audiorecorder-9bb5e';
                const collectionName = 'recordings';
                const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?key=${apiKey}`;

                // const endpoint = `https://firestore.googleapis.com/v1/projects/audiorecorder-9bb5e/databases/(default)/documents/recordings?key=AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o`;
                const recordingInfo = {
                    "fields": {
                        "duration": {
                            "stringValue": `${getDurationFormatted(status.durationMillis)}`
                        },
                        "title": {
                            "stringValue": `${title}`
                        },
                        "fileUrl": {
                            // 'stringValue': `${}`
                        },
                    }
                }


                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(recordingInfo),
                })

                const recordingsInfo = await response.json()
                console.log('recordings', recordingsInfo);


                let updatedRecordings = [
                    ...recordings,
                    {
                        sound: sound,
                        duration: getDurationFormatted(status.durationMillis),
                        file: audioFile,
                        title: title,
                    },
                ];
                setRecordings(updatedRecordings);
                setRecording(null);
                setTitle('');
            }

        } catch (err) {
            console.log(err);
        }
        console.log('==========', recordings);
    }

    function getDurationFormatted(millis) {

        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60)
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}: ${secondsDisplay}`;
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style={styles.row}>

                    <Text style={styles.fill}>
                        {recordingLine.normalObject.title} - {recordingLine.normalObject.duration}
                    </Text>
                    <Foundation name="play-circle"
                        onPress={() => recordingLine.sound.replayAsync()}
                        size={25} color="black" />


                    {editTitle === index ? (

                        <View>
                            <Button
                                style={styles.button}
                                onPress={() => updateRecording(index)}
                                title="Update"
                            />
                        </View>

                    ) : (
                        <View style={styles.editContainer}>
                            {/* <MaterialCommunityIcons name="circle-edit-outline"
                                onPress={() => editRecording(index)}
                                size={30} color="black" /> */}
                                 <Button
                                style={styles.button}
                                onPress={() => editRecording(index)}
                                title="edit"
                            />
                        </View>

                    )}
                    <MaterialCommunityIcons name="delete-circle-outline"
                        size={30}
                        onPress={() => removeRecording(index)}
                        color="black" />

                </View>
            );
        });
    }


    async function updateRecording(index) {

        const recording = recordings[index]
        const projectId = 'audiorecorder-9bb5e';
        const collectionName = 'recordings';
        const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${recording.id}?currentDocument.exists=true&updateMask.fieldPaths=title&alt=json`;

        const recordingUpdate = {
            "fields": {
                "title": {
                    "stringValue": `${title}`
                },
            }
        }

        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordingUpdate),
            })

            if (response) {
                const updatedRecordings = [...recordings];
                updatedRecordings[index].fields.title.stringValue = title;
                setRecordings(updatedRecordings);
                setEditTitle(-1)
                alert('Updated')
            } else {
                console.log('failed to update')
            }

        } catch (error) {
            console.log(error);

        }

    }

    function editRecording(index) {
        setEditTitle(index);
        setTitle(recordings[index].normalObject.title);
        // setEditTitle('')
    }

    async function removeRecording(index) {
        const recording = recordings[index]
        const projectId = 'audiorecorder-9bb5e';
        const collectionName = 'recordings';
        // const endpoint = `https://firestore.googleapis.com/v1/projects/audiorecorder-9bb5e/databases/(default)/documents/recordings?key=AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o`;
        const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${recording.id}?&&key=${apiKey}`;
       

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response) {
                const audioRef = Ref(storage, `audio/${recordingToDelete.normalObject.title}`)
                await deleteObject(audioRef)

                const updatedRecording = [...recordings]
                updatedRecording.splice(title, 1)
                setRecordings(updatedRecording)
                alert('Deleted')
            } else {
                console.log('failed to delete')
            }

        } catch (error) {
            console.log(error);

        }
    }

    const fetchData = async () => {

        
            try {
                const apiKey = "AIzaSyArFvwnwXdIwpFXT2qufwBgqwaVJslja4o";

                const projectId = 'audiorecorder-9bb5e';
                const collectionName = 'recordings';
                const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?key=${apiKey}`;

                const response = await fetch(endpoint);
                const responseData = await response.json();
                const documents = responseData.documents || [];
                const recordingsArray = []
                documents.forEach(document => {
                    const data = document.fields; // Assuming data is stored in "fields"
                    const parts = document.name.split('/');
                    const id = parts[parts.length - 1]; // The last part is the document ID
                    let normalObject = {}
                    for (let key in data) {
                        normalObject = { ...normalObject, [key]: data[key].stringValue }
                    }
                    recordingsArray.push({ id: id, normalObject })
                   
                });
                setRecordings(recordingsArray);
            } catch (err) {
                console.error('Error fetching Firestore data: ', err);
            }
       


    }



    useEffect(() => {
        fetchData()

    }, [recordings])



    const handleSignOut = () => {

    }
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.line}>Ready to make some soundwaves together?</Text>
                <Text>{messege}</Text>
                <TextInput
                    onChangeText={setTitle}
                    placeholder='title'
                    style={styles.inputText}
                    value={title} />

                <Button
                    title={recording ? 'stopRecording' : 'startRecording'}
                    onPress={recording ? stopRecording : startRecording}
                />


                {/* <MaterialCommunityIcons name="record-rec"
                    onPress={recording ? stopRecording : startRecording}
                    size={100} color="red" /> */}
                {getRecordingLines()}

                <StatusBar style="auto" />
            </View>

            <View style={styles.container3}>
                <Text>Email: </Text>
                <TouchableOpacity
                    onPress={() => handleSignOut()}
                    style={styles.button1}
                >
                    <Text style={styles.buttonText1}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Homescreen

const styles = StyleSheet.create({

    container3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button1: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText1: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#BAE5E3',
        alignItems: 'center',
        justifyContent: 'center',

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        flex: 1,
        margin: 16,
        fontSize: 20,
        color: '#153638',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    button: {

        backgroundColor: 'red',
        borderWidth: 'none',
        borderColor: 'white',
        color: 'white',
        padding: 15,
        textAlign: 'center',
        display: 'inlineBlock',
        fontSize: 16,
        margin: 4,
    },
    editContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,

    },
    inputText: {
        width: 250,
        backgroundColor: '#378D90',
        color: 'white',
        padding: 14,
        margin: 8,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 50,
    },
    line: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    }


})