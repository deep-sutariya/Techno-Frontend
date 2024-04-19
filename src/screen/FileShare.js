import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

async function requestStoragePermission() {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      console.log('Storage permission granted');
    } else {
      console.log('Storage permission denied');
    }
  } catch (error) {
    console.error('Error requesting storage permission:', error);
  }
}


const FileReceivingScreen = () => {
    const [receivedFileUri, setReceivedFileUri] = useState(null);

    useEffect(() => {
        requestStoragePermission();
    }, [])

    const handlePickFile = async () => {
        try {
            const pickedFile = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            if (pickedFile.assets[0].uri) {
                setReceivedFileUri(pickedFile.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    const handleReadFile = async () => {
        try {
            if (receivedFileUri) {
                const fileInfo = await FileSystem.getInfoAsync(receivedFileUri);
                if (fileInfo.exists) {
                    const fileContent = await FileSystem.readAsStringAsync(receivedFileUri);
                    console.log('Received file content:', JSON.stringify(fileContent));
                    //   handleConvertToImage(receivedFileUri);
                }
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    const handleSaveFile = async () => {
        try {
            if (receivedFileUri) {
                const fileInfo = await FileSystem.getInfoAsync(receivedFileUri);
                if (fileInfo.exists) {
                    const fileContent = await FileSystem.readAsStringAsync(receivedFileUri);

                    // Define the directory where you want to save the file
                    const directory = `${FileSystem.documentDirectory}receivedFiles/`;
                    // Generate a unique file name
                    const fileName = `receivedFile_${Date.now()}.txt`;
                    // Construct the path for the new file
                    const filePath = directory + fileName;

                    // Create the directory if it doesn't exist
                    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

                    // Write the file content to the new file
                    await FileSystem.writeAsStringAsync(filePath, fileContent);

                    console.log('File saved successfully:', filePath);
                }
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const handleMoveFileToExternalStorage = async () => {
        try {
            if (receivedFileUri) {
                const fileInfo = await FileSystem.getInfoAsync(receivedFileUri);
                if (fileInfo.exists) {
                    const directory = FileSystem.documentDirectory;
                    const fileName = fileInfo.uri.split('/').pop(); // Extract the file name
                    const destinationUri = `${FileSystem.documentDirectory}/../${fileName}`;

                    // Move the file to external storage
                    await FileSystem.moveAsync({
                        from: receivedFileUri,
                        to: destinationUri
                    });

                    console.log('File moved to external storage:', destinationUri);
                }
            }
        } catch (error) {
            console.error('Error moving file to external storage:', error);
        }
    };



    useEffect(() => {
        console.log("-->" + receivedFileUri);
    }, [receivedFileUri])

    return (
        <View>
            <Button title="Pick File" onPress={handlePickFile} />
            {receivedFileUri && (
                <View style={{ marginTop: 20 }}>
                    <Text>Received File URI:</Text>
                    <Text>{receivedFileUri}</Text>
                    <Button title="Read File" onPress={handleReadFile} />
                    <Button title="SAVE File" onPress={handleMoveFileToExternalStorage} />
                </View>
            )}
        </View>
    );
};

export default FileReceivingScreen;
