import React, { useState, useEffect } from 'react'; // Imports core React functionalities: useState for state management, useEffect for side effects.
import { // Imports various React Native components for building UI.
    View, // A container component that supports layout with flexbox, style, some touch handling, and accessibility controls.
    Text, // A component for displaying text.
    StyleSheet, // A module to create and manage styles for components.
    TouchableOpacity, // A wrapper for making views respond properly to touches, with a dimmed effect.
    Modal, // A component that presents content above an enclosing view.
    TextInput, // A component for gathering text input from the user.
    ScrollView, // A scrolling container that can host multiple components and views.
    Alert, // Provides a way to show alerts to the user.
    ImageBackground,
    Button,
    Image,
    Platform, // A component for displaying an image as a background.
} from 'react-native'; // Specifies the React Native library for imports.
import axios from 'axios'; // Imports Axios for making HTTP requests to external APIs.
import AsyncStorage from '@react-native-async-storage/async-storage'; // Imports AsyncStorage for persistent key-value storage.
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';


const RequestModal = ({ visible, onClose, type, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [enquiryType, setEnquiryType] = useState('');
    const [errors, setErrors] = useState({});
    const [imageUri, setImageUri] = useState();
    const [selectedDoc, setSelectedDoc] = useState();
    // console.log("selectedDoc===>", selectedDoc)
    // Reset form when modal opens
    useEffect(() => {
        if (visible) {
            setName('');
            setEmail('');
            setPhone('');
            setTitle('');
            setEnquiryType('');
            setImageUri(null);
            setSelectedDoc(null);
            setErrors({});
        }
    }, [visible]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const validateTextOnly = (text) => {
        const textRegex = /^[a-zA-Z\s]*$/;
        return textRegex.test(text);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = 'Name is required';
        } else if (!validateTextOnly(name)) {
            newErrors.name = 'Name should only contain letters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!title) {
            newErrors.title = 'Title is required';
        } else if (!validateTextOnly(title)) {
            newErrors.title = 'Title should only contain letters';
        }

        if (!enquiryType) {
            newErrors.enquiryType = 'Enquiry type is required';
        } else if (!validateTextOnly(enquiryType)) {
            newErrors.enquiryType = 'Enquiry type should only contain letters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const formData = {
            name,
            email,
            phone,
            title,
            enquiryType: enquiryType.trim(),
            imageUri,
            selectedDoc,
        };

        // console.log('RequestModal - Submitting form data:', formData);
        onSubmit(formData);
    };
    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is required!');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            console.log('Camera Image URI:', result.assets[0].uri);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // for all types or 'application/pdf' for only PDFs
                copyToCacheDirectory: true,
            });

            if (result?.assets?.length > 0) {
                const file = result.assets[0];
                console.log("Selected File:", file);
                setSelectedDoc({
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream',
                });
            }
        } catch (err) {
            console.error("Document pick error:", err);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {type === 'complaint' ? 'Submit Complaint' : 'Request Support'}
                    </Text>

                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => {
                                if (validateTextOnly(text) || text === '') {
                                    setName(text);
                                    setErrors(prev => ({ ...(prev || {}), name: '' }));
                                }
                            }}
                            placeholderTextColor="#999"
                        />
                        {/* {errors.name && <Text style={styles.errorText}>{errors.name}</Text>} */}

                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors(prev => ({ ...(prev || {}), email: '' }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <TextInput
                            style={[styles.input, errors.phone && styles.inputError]}
                            placeholder="Phone"
                            value={phone}
                            onChangeText={(text) => {
                                if (/^\d*$/.test(text)) {
                                    setPhone(text);
                                    setErrors(prev => ({ ...(prev || {}), phone: '' }));
                                }
                            }}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholderTextColor="#999"
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        <TextInput
                            style={[styles.input, errors.title && styles.inputError]}
                            placeholder="Title"
                            value={title}
                            onChangeText={(text) => {
                                if (validateTextOnly(text) || text === '') {
                                    setTitle(text);
                                    setErrors(prev => ({ ...(prev || {}), title: '' }));
                                }
                            }}
                            placeholderTextColor="#999"
                        />
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                        <TextInput
                            style={[styles.input, errors.enquiryType && styles.inputError]}
                            placeholder="Enquiry Type"
                            value={enquiryType}
                            onChangeText={(text) => {
                                if (validateTextOnly(text) || text === '') {
                                    setEnquiryType(text);
                                    setErrors(prev => ({ ...(prev || {}), enquiryType: '' }));
                                }
                            }}
                            placeholderTextColor="#999"
                        />
                        {errors.enquiryType && <Text style={styles.errorText}>{errors.enquiryType}</Text>}
                        <View style={styles.uploadSection}>
                            <Text style={styles.sectionLabel}>Upload File or Take Picture</Text>
                            <View style={styles.uploadButtons}>
                                <Button title="Take Photo" onPress={openCamera} />
                                <View style={{ width: 10 }} />
                                <Button title="Pick a Document" onPress={pickDocument} />
                                <Text>{selectedDoc?.name}</Text>
                            </View>

                            {imageUri && (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.preview}
                                    resizeMode="cover"
                                />
                            )}

                            {selectedDoc && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: '#555' }}>Selected File: {selectedDoc.name}</Text>
                                </View>
                            )}

                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
export default function Dashboard({ navigation }) { // Defines the main Dashboard functional component, receiving navigation prop.
    const [modalVisible, setModalVisible] = useState(false); // State for the visibility of the request modal.
    const [modalType, setModalType] = useState(''); // State for the type of request (complaint or support).
    const [userData, setUserData] = useState({ // State to store user data (id, name, email).
        id: null, // User ID, initially null.
        name: '', // User's name, initially empty.
        email: '', // User's email, initially empty.
    });
    const [userToken, setUserToken] = useState(null); // State to store the authentication token.

    useEffect(() => { // Hook to load user data and token when the component mounts.
        const loadUserData = async () => { // Async function to load data.
            try { // Tries to get items from AsyncStorage.
                const storedToken = await AsyncStorage.getItem('userToken'); // Retrieves the user token.
                const storedUserData = await AsyncStorage.getItem('userData'); // Retrieves the user data.

                if (storedToken) { // Checks if a token was found.
                    setUserToken(storedToken); // Sets the userToken state.
                }
                if (storedUserData) { // Checks if user data was found.
                    const parsedData = JSON.parse(storedUserData); // Parses the stored JSON string back into an object.
                    setUserData({ // Sets the userData state with parsed values.
                        id: parsedData.id, // Sets the user ID.
                        name: parsedData.name, // Sets the user name.
                        email: parsedData.email, // Sets the user email.
                    });
                    console.log('Dashboard: User data loaded from AsyncStorage:', parsedData); // Logs the loaded user data for debugging.
                }
            } catch (error) { // Catches any errors during AsyncStorage operations.
                console.error('Failed to load user data or token from AsyncStorage', error); // Logs the error.
            }
        };
        loadUserData(); // Calls the function to load user data.
    }, []); // Empty dependency array means this effect runs only once after the initial render.

    const handleOpenModal = (type) => { // Function to open the request modal.
        setModalType(type); // Sets the type of request.
        setModalVisible(true); // Makes the request modal visible.
    };

    const handleCloseModal = () => { // Function to close the request modal.
        setModalVisible(false); // Hides the request modal.
    };

    const handleLogout = async () => { // Async function to handle user logout.
        Alert.alert( // Displays an alert dialog for logout confirmation.
            'Logout', // Alert title.
            'Are you sure you want to log out?', // Alert message.
            [ // Array of buttons for the alert.
                { text: 'Cancel', style: 'cancel' }, // Cancel button.
                {
                    text: 'Logout', // Logout button.
                    onPress: async () => { // Function to execute when logout button is pressed.
                        navigation.replace('Login'); // Navigates to the Login screen, replacing the current stack.
                    },
                },
            ],
            { cancelable: true } // Allows the alert to be dismissed by tapping outside or pressing back.
        );
    };

    // const handleComplaintSubmit = async (data) => {
    //     const formData = new FormData();
    //     const json = {
    //         name: data.name,
    //         email: data.email,
    //         phone: data.phone,
    //         title: data.title,
    //         enquiryType: data.enquiryType || '',
    //     };
    //     formData.append('json', JSON.stringify(json));
    //     if (data.imageUri) {
    //         const uri = Platform.OS === 'ios' ? data.imageUri.replace('file://', '') : data.imageUri;
    //         const filename = uri.split('/').pop();
    //         const ext = filename?.split('.').pop();
    //         const type = ext ? `image/${ext}` : 'image/jpeg';

    //         formData.append('file', {
    //             uri,
    //             type,
    //             name: filename,
    //         });
    //     }
    //     if (data.selectedDoc) {
    //         formData.append('file', {
    //             uri: selectedDoc.uri,
    //             name: selectedDoc.name,
    //             type: selectedDoc.type,
    //         });
    //     }

    //     try {
    //         const response = await axios.post(
    //             'https://iiscapis.bridgebrilliance.com/iisc/email/compalin-email',
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 }
    //             }
    //         );
    //         console.log("response", response?.data)
    //         Alert.alert('Success', 'Complaint submitted successfully!');
    //     } catch (err) {
    //         console.error('Upload error:', err.response?.data || err.message);
    //         Alert.alert('Error', 'Failed to submit complaint.');
    //     }
    // };

    const handleComplaintSubmit = async (data) => {
        const formData = new FormData();

        // JSON body
        const json = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            title: data.title,
            enquiryType: data.enquiryType || '',
        };
        formData.append('json', JSON.stringify(json));

        // Camera image (optional)
        if (data.imageUri) {
            const uri = Platform.OS === 'ios' ? data.imageUri.replace('file://', '') : data.imageUri;
            formData.append('file', {
                uri,
                name: 'camera.jpg',
                type: 'image/jpeg',
            });
        }

        // Document (optional)
        if (data.selectedDoc) {
            const uri = Platform.OS === 'ios'
                ? data.selectedDoc.uri.replace('file://', '')
                : data.selectedDoc.uri;

            formData.append('file', {
                uri,
                name: data.selectedDoc.name,
                type: data.selectedDoc.type,
            });
        }

        try {
            const response = await axios.post(
                'https://iiscapis.bridgebrilliance.com/iisc/email/compalin-email',
                formData,
                {
                   headers: {
                        'Content-Type': 'multipart/form-data',
                     }
                }
            );
            console.log('Upload success:', response.data);
            Alert.alert('Success', 'Complaint submitted successfully!');
        } catch (err) {
            console.error('Upload failed:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to submit complaint.');
        }
    };


    const handleSupportSubmit = async (data) => {
        console.log('Dashboard - Received form data for support:', data); // Debug log
        const formData = new FormData();
        const jsonPayload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            title: data.title,
            // According to the provided API specification for support requests:
            // enquertytype (string): Should be set to "Support"
            enquertytype: "Support", // Hardcoded value and spelling as per API spec
        };

        formData.append("json", JSON.stringify(jsonPayload));

        try {
            const res = await axios.post(
                "https://iiscapis.bridgebrilliance.com/iisc/email/support-email",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            console.log("Success:", res.data);
            Alert.alert('Success', res.data.message || 'Support request submitted successfully!');
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            Alert.alert('Error', err.response?.data?.message || 'Failed to submit support request. Please try again.');
        }
        handleCloseModal();
    };

    return ( // Renders the main Dashboard UI.
        <ImageBackground // Background image for the dashboard.
            source={require('../assests/bg.jpg')} // Specifies the image source.
            style={styles.backgroundContainer} // Applies styling for the background image.
            resizeMode="cover" // Sets the image resize mode.
        >
            <View style={styles.container}>
                <View style={styles.topButtonContainer}>
                    <TouchableOpacity style={styles.topButton} onPress={handleLogout}>
                        <Text style={styles.topButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.welcomeText}>Welcome to IISC Support</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity // Complaint button.
                        style={[styles.button, styles.complaintButton]} // Applies multiple styles.
                        onPress={() => handleOpenModal('complaint')} // Opens modal with 'complaint' type.
                    >
                        <Text style={styles.buttonText}>Complaint</Text>
                    </TouchableOpacity>

                    <TouchableOpacity // Support button.
                        style={[styles.button, styles.supportButton]} // Applies multiple styles.
                        onPress={() => handleOpenModal('support')} // Opens modal with 'support' type.
                    >
                        <Text style={styles.buttonText}>Support</Text>
                    </TouchableOpacity>
                </View>

                <RequestModal // Renders the RequestModal component.
                    visible={modalVisible} // Controls its visibility.
                    onClose={handleCloseModal} // Function to close the modal.
                    type={modalType} // Type of request for the modal.
                    onSubmit={modalType === 'complaint' ? handleComplaintSubmit : handleSupportSubmit} // Function to handle modal submission.
                />
            </View> // Ends main container.
        </ImageBackground> // Ends background image component.
    );
}

const styles = StyleSheet.create({ // Defines styles for the components using StyleSheet.create.
    backgroundContainer: { // Style for the background image container.
        flex: 1, // Takes up all available space.
        width: '100%', // Full width.
        height: '100%', // Full height.
        justifyContent: 'center', // Centers content vertically.
        alignItems: 'center', // Centers content horizontally.
    },
    container: { // Style for the main content container.
        padding: 20, // Adds padding.
        alignItems: 'center', // Centers items horizontally.
        flex: 1, // Takes up all available space.
        width: '100%', // Full width.
    },
    welcomeText: { // Style for the welcome text.
        fontSize: 24, // Font size.
        fontWeight: 'bold', // Font weight.
        textAlign: 'center', // Text alignment.
        marginVertical: 30, // Vertical margin.
        color: '#fff', // Text color.
        marginTop: 100, // Top margin to offset top buttons.
    },
    buttonContainer: { // Style for the container of complaint/support buttons.
        flexDirection: 'row', // Arranges children in a row.
        justifyContent: 'space-around', // Distributes space evenly around items.
        marginTop: 20, // Top margin.
        width: '100%', // Full width.
    },
    button: { // Base style for complaint/support buttons.
        paddingVertical: 15, // Vertical padding.
        paddingHorizontal: 30, // Horizontal padding.
        borderRadius: 30, // Border radius for rounded corners.
        minWidth: 140, // Minimum width.
        alignItems: 'center', // Centers content horizontally.
        shadowColor: '#000', // Shadow color.
        shadowOffset: { // Shadow offset.
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25, // Shadow opacity.
        shadowRadius: 3.84, // Shadow blur radius.
        elevation: 5, // Android elevation for shadow.
    },
    complaintButton: { // Specific style for the complaint button.
        backgroundColor: '#FF6B6B', // Background color.
    },
    supportButton: { // Specific style for the support button.
        backgroundColor: '#4ECDC4', // Background color.
    },
    buttonText: { // Style for text inside buttons.
        color: '#fff', // Text color.
        fontSize: 16, // Font size.
        fontWeight: 'bold', // Font weight.
    },
    modalContainer: { // Style for the modal's outer container.
        flex: 1, // Takes up all available space.
        justifyContent: 'center', // Centers content vertically.
        alignItems: 'center', // Centers content horizontally.
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background.
    },
    modalContent: { // Style for the modal's inner content area.
        backgroundColor: '#fff', // White background.
        borderRadius: 20, // Border radius.
        padding: 20, // Padding.
        width: '90%', // 90% width.
        maxHeight: '80%', // Max height.
        shadowColor: '#000', // Shadow color.
        shadowOffset: { // Shadow offset.
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25, // Shadow opacity.
        shadowRadius: 3.84, // Shadow blur radius.
        elevation: 5, // Android elevation for shadow.
    },
    scrollViewContent: { // Style for the scroll view's content container.
        flexGrow: 1, // Allows content to grow.
        paddingBottom: 20, // Bottom padding.
    },
    modalTitle: { // Style for modal titles.
        fontSize: 20, // Font size.
        fontWeight: 'bold', // Font weight.
        marginBottom: 20, // Bottom margin.
        textAlign: 'center', // Text alignment.
        color: '#333', // Text color.
    },
    input: { // Style for text input fields.
        backgroundColor: '#f8f8f8', // Background color.
        borderRadius: 10, // Border radius.
        padding: 15, // Padding.
        marginBottom: 15, // Bottom margin.
        borderWidth: 1, // Border width.
        borderColor: '#ddd', // Border color.
        color: '#333', // Text color.
    },
    modalButtonContainer: { // Style for modal button containers.
        flexDirection: 'row', // Arranges children in a row.
        justifyContent: 'space-around', // Distributes space evenly.
        marginTop: 20, // Top margin.
    },
    modalButton: { // Base style for modal buttons.
        paddingVertical: 12, // Vertical padding.
        paddingHorizontal: 25, // Horizontal padding.
        borderRadius: 25, // Border radius.
        minWidth: 100, // Minimum width.
        alignItems: 'center', // Centers content.
        shadowColor: '#000', // Shadow color.
        shadowOffset: { // Shadow offset.
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25, // Shadow opacity.
        shadowRadius: 3.84, // Shadow blur radius.
        elevation: 5, // Android elevation.
    },
    cancelButton: { // Specific style for cancel button.
        backgroundColor: '#999', // Background color.
        marginRight: 10, // Right margin.
    },
    submitButton: { // Specific style for submit button.
        backgroundColor: '#6C00FF', // Background color.
    },
    topButtonContainer: { // Style for the top button container.
        flexDirection: 'row', // Arranges children in a row.
        justifyContent: 'space-between', // Distributes space evenly between items.
        width: '100%', // Full width.
        paddingHorizontal: 20, // Horizontal padding.
        marginTop: 50, // Top margin.
        position: 'absolute', // Positions absolutely.
        top: 0, // Aligns to the top.
        left: 0, // Aligns to the left.
        right: 0, // Aligns to the right.
        zIndex: 10, // Ensures buttons are on top of other content.
    },
    topButton: { // Style for individual top buttons.
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background.
        paddingVertical: 10, // Vertical padding.
        paddingHorizontal: 15, // Horizontal padding.
        borderRadius: 20, // Border radius.
    },
    topButtonText: { // Style for text inside top buttons.
        color: '#fff', // Text color.
        fontSize: 14, // Font size.
        fontWeight: 'bold', // Font weight.
    },
    inputError: {
        borderColor: '#FF6B6B',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 5,
    },
    uploadSection: {
        marginVertical: 20,
    },

    uploadButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    preview: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginTop: 10,
    },

    docText: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },

    sectionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },

});
