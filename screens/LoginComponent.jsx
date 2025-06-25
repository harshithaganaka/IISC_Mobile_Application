import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
} from 'react-native';

export default function App({ navigation }) {
  const [email, setEmail] = useState(''); // State for the user's email input.
  const [password, setPassword] = useState(''); // State for the user's password input.
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility.
  const [loading, setLoading] = useState(false); // State to indicate if an asynchronous operation is in progress.
  const [error, setError] = useState(null); // State to store any error messages.

  const handleLogin = async () => { // Async function to handle the user login process.
    if (!email || !password) { // Validates if email and password fields are not empty.
      Alert.alert('Error', 'Email and password required'); // Shows an alert if fields are missing.
      return; // Stops the function execution.
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/; // Simplified regex // Regular expression for basic email format validation.
    if (!emailRegex.test(email)) { // Checks if the entered email matches the regex pattern.
      Alert.alert('Invalid Email', 'Please enter a valid email address.'); // Shows an alert for invalid email format.
      return; // Stops the function execution.
    }
    navigation.replace('Dashboard');
    try { // Tries to send the login request.
      const response = await axios.post(`https://iiscapis.bridgebrilliance.com/iisc/auth/sign-in`, { email, password }); // Sends a POST request to the sign-in API with email and password.

      if (response.data && response.data.token) { // Checks if the response contains data and a token, indicating successful login.
        await AsyncStorage.setItem('userToken', response.data.token); // Stores the authentication token in AsyncStorage.
        await AsyncStorage.setItem('userData', JSON.stringify({ // Stores user data (id, name, email, phone) in AsyncStorage as a JSON string.
          id: response.data.id, // User ID from the response.
          name: response.data.name, // User's name from the response.
          email: response.data.email, // User's email from the response.
          phone: response.data.phone // User's phone from the response (assuming it's present).
        }));

        Alert.alert('Success', 'Login successful!'); // Shows a success alert.
        navigation.replace('Dashboard'); // Navigates to the 'Dashboard' screen, replacing the current navigation stack.
      } else { // Handles cases where API call is successful but login failed (e.g., invalid credentials).
        const errorMessage = response.data?.message || 'Login failed.'; // Gets the error message from the response or defaults to 'Login failed.'.
        Alert.alert('Login Failed', errorMessage); // Shows an alert for login failure.
        setError(errorMessage); // Sets the error message state.
      }
    } catch (err) { // Catches any errors during the API call.
      console.error("Login Error:", err.response?.data || err.message); // Logs the error details to the console.
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.'; // Gets the error message from the response or defaults.
      Alert.alert('Login Failed', errorMessage); // Shows an alert for login failure.
      setError(errorMessage); // Sets the error message state.
    } finally { // This block always executes after try/catch.
      setLoading(false); // Sets loading state to false, hiding the activity indicator.
    }
  }

  return (
    <>
      <ImageBackground // Background image for the screen.
        source={require('../assests/bg.jpg')} // Specifies the image source.
        style={styles.container} // Applies styling for the background image.
        resizeMode="cover" // Sets the image resize mode to cover the entire container.
      >
        <View style={styles.header}>
          {/* <Image source={require('../assets/IIsc_image.png')} style={styles.avatar} /> */}
          <Text style={styles.welcome}>WELCOME TO IISC</Text>
        </View>

        <TextInput // Input field for the email address.
          style={styles.input} // Applies styling to the input field.
          placeholder="Email" // Placeholder text.
          value={email} // Binds the input value to the email state.
          onChangeText={setEmail} // Updates the email state when text changes.
          placeholderTextColor="#999" // Sets the color for the placeholder text.
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
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? ( // Conditionally renders an activity indicator or button text.
            <ActivityIndicator color="#fff" /> // Shows a white loading spinner.
          ) : (
            <Text style={styles.buttonText}>SIGN IN</Text> // Shows "SIGN IN" text.
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Optional: Display error message on screen */}
        {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
      </ImageBackground> // Ends the background image component.
    </>
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
    marginBottom: 8, // Bottom margin.
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
  rememberRow: { // Style for the "Remember Me" row.
    flexDirection: 'row', // Arranges children in a row.
    alignItems: 'center', // Centers items vertically.
    marginBottom: 24, // Bottom margin.
  },
  button: { // Style for the main action button (SIGN IN).
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
  link: { // Style for navigation links (e.g., "SIGN UP").
    textAlign: 'center', // Centers text.
    color: '#fff', // White text color.
    marginTop: 20, // Top margin.
    textDecorationLine: 'underline', // Underlines the text.
  },
  // errorText: { // (Commented out) Style for error messages.
  //   color: 'red', // Red text color.
  //   textAlign: 'center', // Centers text.
  //   marginTop: 10, // Top margin.
  // },
});
