import React, { useState, useEffect } from 'react'; // Imports core React functionalities: useState for state management, useEffect for side effects.
import { // Imports various React Native components for building UI.
  View, // A container component that supports layout with flexbox, style, some touch handling, and accessibility controls.
  Text, // A component for displaying text.
  TextInput, // A component for gathering text input from the user.
  TouchableOpacity, // A wrapper for making views respond properly to touches, with a dimmed effect.
  StyleSheet, // A module to create and manage styles for components.
  Image, // A component for displaying images.
  ImageBackground, // A component for displaying an image as a background.
  Alert, // Provides a way to show alerts to the user.
  ActivityIndicator, // A component that displays a circulating loading indicator.
} from 'react-native'; // Specifies the React Native library for imports.
import axios from 'axios'; // Imports Axios for making HTTP requests to external APIs.

export default function SignupScreen({ navigation }) { // Defines the SignupScreen functional component, receiving navigation prop.
  const [name, setName] = useState(''); // State for the user's full name.
  const [phone, setPhone] = useState(''); // State for the user's phone number.
  const [email, setEmail] = useState(''); // State for the user's email.
  const [password, setPassword] = useState(''); // State for the user's password.
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility.
  const [loading, setLoading] = useState(false); // State to indicate if an asynchronous operation is in progress.
  const [error, setError] = useState(null); // State to store any error messages.
  const [success, setSuccess] = useState(false); // State to indicate if registration was successful.

  const handleRegistration = async () => { // Async function to handle the user registration process.
    if (!name || !phone || !email || !password) { // Validates if all required fields are filled.
      Alert.alert('Error', 'All fields are required'); // Shows an alert if any field is missing.
      return; // Stops the function execution.
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for basic email format validation.
    if (!emailRegex.test(email)) { // Checks if the entered email matches the regex pattern.
      Alert.alert('Invalid Email', 'Please enter a valid email address.'); // Shows an alert for invalid email format.
      return; // Stops the function execution.
    }

    let sendData = {
      name: name,
      email: email,
      phone: phone,
      password: password
    }

    // // let response =
    // console.log("sendData==>", sendData)
    try {
      let response = await axios.post('https://iiscapis.bridgebrilliance.com/iisc/auth/sign-up', sendData);

      console.log("Response==>", response)
      if (response.data) {
        console.log("Response==>", response.data)
        navigation.replace('Login');
      }
    } catch (error) {
      console.log("error==>", error)
      alert(`${error.message}`)
    }

    // setLoading(true); // Sets loading state to true, showing the activity indicator.
    // setError(null); // Clears any previous error messages.
    // setSuccess(false); // Resets the success status.
  }
  return ( // Renders the UI for the Signup screen.
    <ImageBackground // Background image for the screen.
      source={require('../assests/bg.jpg')} // Specifies the image source.
      style={styles.container} // Applies styling for the background image.
      resizeMode="cover" // Sets the image resize mode to cover the entire container.
    >
      <View style={styles.header}>
        {/* <Image source={require('../assets/IIsc_image.png')} style={styles.avatar} /> */}
        <Text style={styles.welcome}>CREATE ACCOUNT</Text>
      </View>

      <TextInput // Input field for the full name.
        style={styles.input} // Applies styling to the input field.
        placeholder="Full Name" // Placeholder text.
        value={name} // Binds the input value to the name state.
        onChangeText={setName} // Updates the name state when text changes.
        placeholderTextColor="#999" // Sets the color for the placeholder text.
        autoCapitalize="words" // Capitalizes the first letter of each word.
      />

      <TextInput // Input field for the phone number.
        style={styles.input} // Applies styling.
        placeholder="Phone Number" // Placeholder text.
        value={phone} // Binds the input value to the phone state.
        onChangeText={setPhone} // Updates the phone state when text changes.
        placeholderTextColor="#999" // Placeholder text color.
        keyboardType="phone-pad" // Sets the keyboard type to a phone keypad.
      />

      <TextInput // Input field for the email address.
        style={styles.input} // Applies styling.
        placeholder="Email" // Placeholder text.
        value={email} // Binds the input value to the email state.
        onChangeText={setEmail} // Updates the email state when text changes.
        placeholderTextColor="#999" // Placeholder text color.
        keyboardType="email-address" // Sets the keyboard type for email input.
        autoCapitalize="none" // Prevents automatic capitalization.
      />

      <View style={styles.passwordContainer}>
        <TextInput // Input field for the password.
          style={styles.inputPassword} // Applies styling.
          placeholder="Password" // Placeholder text.
          value={password} // Binds the input value to the password state.
          onChangeText={setPassword} // Updates the password state when text changes.
          secureTextEntry={!showPassword} // Toggles text visibility for password security.
          placeholderTextColor="#999" // Placeholder text color.
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity // Button for submitting the registration form.
        style={styles.button} // Applies styling.
        onPress={handleRegistration} // Calls handleRegistration function when pressed.
        disabled={loading} // Disables the button when loading.
      >
        {loading ? ( // Conditionally renders an activity indicator or button text.
          <ActivityIndicator color="#fff" /> // Shows a white loading spinner.
        ) : (
          <Text style={styles.buttonText}>SIGN UP</Text> // Shows "SIGN UP" text.
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? SIGN IN</Text>
      </TouchableOpacity>

      {/* Optional: Display error message on screen */}
      {/* {error && <Text style={styles.errorText}>{error}</Text>} */}

    </ImageBackground> // Ends the background image component.
  );
}

const styles = StyleSheet.create({ // Defines a StyleSheet object for consistent styling.
  container: { // Style for the main container.
    flex: 1, // Takes up all available space.
    padding: 24, // Adds padding.
    justifyContent: 'center', // Centers content vertically.
  },
  header: { // Style for the header section.
    alignItems: 'center', // Centers items horizontally.
    marginBottom: 32, // Bottom margin.
  },
  avatar: { // Style for the logo image.
    width: 80, // Width of the image.
    height: 80, // Height of the image.
    marginBottom: 12, // Bottom margin.
  },
  welcome: { // Style for the welcome text.
    fontSize: 24, // Font size.
    color: '#fff', // Text color.
    fontWeight: 'bold', // Font weight.
    textTransform: 'uppercase', // Transforms text to uppercase.
  },
  input: { // Style for general text input fields.
    backgroundColor: '#fff', // White background.
    borderRadius: 20, // Border radius for rounded corners.
    paddingHorizontal: 20, // Horizontal padding.
    paddingVertical: 12, // Vertical padding.
    marginBottom: 16, // Bottom margin.
    color: '#333', // Ensure text is visible // Text color.
  },
  passwordContainer: { // Style for the password input and toggle button container.
    flexDirection: 'row', // Arranges children in a row.
    alignItems: 'center', // Centers items vertically.
    backgroundColor: '#fff', // White background.
    borderRadius: 20, // Border radius.
    paddingHorizontal: 20, // Horizontal padding.
    marginBottom: 24, // Bottom margin.
  },
  inputPassword: { // Style for the password text input itself.
    flex: 1, // Allows the input to take up available space.
    paddingVertical: 12, // Vertical padding.
    color: '#333', // Ensure text is visible // Text color.
  },
  showText: { // Style for the show/hide password text.
    color: '#6C00FF', // Text color (purple).
    fontWeight: 'bold', // Bold font weight.
  },
  button: { // Style for the main action button (SIGN UP).
    backgroundColor: '#6C00FF', // Background color (purple).
    paddingVertical: 14, // Vertical padding.
    borderRadius: 30, // Border radius.
    alignItems: 'center', // Centers content horizontally.
    shadowColor: '#000', // Shadow color.
    shadowOpacity: 0.2, // Shadow opacity.
    shadowRadius: 6, // Shadow blur radius.
    shadowOffset: { width: 0, height: 3 }, // Shadow offset.
    elevation: 4, // Android elevation for shadow.
  },
  buttonText: { // Style for text inside the button.
    color: '#fff', // White text color.
    fontWeight: 'bold', // Bold font weight.
    fontSize: 16, // Font size.
  },
  link: { // Style for navigation links (e.g., "SIGN IN").
    textAlign: 'center', // Centers text.
    color: '#fff', // White text color.
    marginTop: 20, // Top margin.
    textDecorationLine: 'underline', // Underlines the text.
  },

});