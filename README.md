# 🟣 Anony Talk – Anonymous Platform for Mental Health

Anony Talk is a safe and anonymous platform designed to give people the freedom to express their emotions, struggles, and thoughts without fear of judgment.  
The project's main purpose is to reduce the stigma surrounding mental health and to provide a supportive space where individuals can feel heard, understood, and valued.

---

## 🌟 Why Anony Talk?
Mental health issues like stress, trauma, grief, and anxiety often go unspoken due to fear of judgment and lack of safe spaces.  
Anony Talk changes this by providing an anonymous environment where users can openly share their feelings, relate to others, and seek motivation without revealing their identity.

---

## 🚀 Features
- 📝 **Anonymous Posts** – Share emotions, struggles, or experiences without disclosing your identity.  
- 🤝 **Relate Option** – Instead of likes, users can "relate" to posts, fostering empathy and understanding.  
- 🤖 **AI Chatbot** – Provides emotional support, conversation, and basic sentiment analysis.  
- 📚 **Motivational Content** – Curated, category-based content to inspire and support mental well-being.  
- 💬 **Anonymous Peer Chat** – One-on-one anonymous chat to connect with others safely.  
- 🎭 **Avatar Customization** – Express yourself with avatars instead of real photos.  

---

## 💡 Importance
- Creates a **judgment-free environment** for people struggling with mental health issues.  
- Encourages **open conversations** about feelings and emotions.  
- Helps users **connect through empathy** rather than popularity.  
- Provides **instant AI-based support** to users when they feel alone.  
- Works as a **step towards reducing mental health stigma** in society.  

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite  
- **Backend**: Node.js, Express  
- **Database**: SQLite (better-sqlite3)  
- **Authentication**: bcryptjs  

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/snehOP9/anony-talk.git
cd anony-talk
cd anony-talk-fullstack
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create a `.env` file in the `server` directory:
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Chatbot API Key (Optional - for advanced AI features)
OPENAI_API_KEY=your_openai_api_key_here
# OR use other AI services like:
# HUGGINGFACE_API_KEY=your_huggingface_key
# COHERE_API_KEY=your_cohere_key

# Database Configuration (SQLite is used by default)
DB_PATH=./anony-talk.db

# JWT Secret for Authentication (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# CORS Settings
CLIENT_URL=http://localhost:5173
```

### Step 4: Start Backend Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### Step 1: Navigate to Client Directory (from root of anony-talk-fullstack)
```bash
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File (Optional)
Create a `.env` file in the `client` directory:
```bash
VITE_API_URL=http://localhost:5000
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```

The client will run on `http://localhost:5173`

---

## 🤖 Setting Up AI Chatbot with API Key

### Option 1: Using OpenAI API (Recommended)

#### Step 1: Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the API key

#### Step 2: Install OpenAI Package
```bash
cd server
npm install openai
```

#### Step 3: Update `.env` File
```bash
OPENAI_API_KEY=sk-proj-your_actual_key_here
```

#### Step 4: Update `server/routes/chat.js`
Replace the existing chatbot logic with OpenAI integration:

```javascript
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a compassionate mental health support assistant. Provide empathetic, supportive responses. Never diagnose, but encourage professional help when needed."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
```

### Option 2: Using Free AI APIs (Hugging Face)

#### Step 1: Get Hugging Face API Key
1. Visit [Hugging Face](https://huggingface.co/)
2. Create account and get API token from Settings

#### Step 2: Install Axios
```bash
cd server
npm install axios
```

#### Step 3: Update `server/routes/chat.js`
```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: message },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ response: response.data[0].generated_text });
  } catch (error) {
    console.error('Hugging Face Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
```

---

## 📱 Creating Mobile Application (React Native)

### Prerequisites
- Node.js installed
- React Native CLI or Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Step 1: Install Expo CLI (Easier Method)
```bash
npm install -g expo-cli
```

### Step 2: Create New React Native Project
```bash
# Navigate to parent directory
cd "d:\Mental Health"

# Create new Expo project
npx create-expo-app anony-talk-mobile
cd anony-talk-mobile
```

### Step 3: Install Required Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-safe-area-context
npm install react-native-screens
npx expo install react-native-web react-dom @expo/metro-runtime
```

### Step 4: Project Structure
Create the following folder structure:
```
anony-talk-mobile/
├── App.js
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── FeedScreen.js
│   │   ├── ChatbotScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── PostCard.js
│   │   └── Navbar.js
│   ├── services/
│   │   └── api.js
│   └── context/
│       └── AuthContext.js
```

### Step 5: Create API Service (`src/services/api.js`)
```javascript
import axios from 'axios';

// Change this to your backend URL
const API_URL = 'http://your-server-ip:5000/api';

export const authAPI = {
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
};

export const postsAPI = {
  getAllPosts: () => axios.get(`${API_URL}/posts`),
  createPost: (post) => axios.post(`${API_URL}/posts`, post),
};

export const chatAPI = {
  sendMessage: (message) => axios.post(`${API_URL}/chat`, { message }),
};
```

### Step 6: Create Login Screen (`src/screens/LoginScreen.js`)
```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { authAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await authAPI.login({ username, password });
      // Store token and navigate
      navigation.navigate('Dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anony Talk</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
```

### Step 7: Update Main App.js
```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Step 8: Run Mobile App

#### For Android:
```bash
npx expo start
# Press 'a' to open in Android emulator
```

#### For iOS (Mac only):
```bash
npx expo start
# Press 'i' to open in iOS simulator
```

#### For Physical Device:
1. Install **Expo Go** app from Play Store/App Store
2. Run `npx expo start`
3. Scan QR code with Expo Go app

### Step 9: Build APK/IPA for Production

#### Android APK:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

#### iOS IPA (Requires Apple Developer Account):
```bash
eas build --platform ios --profile preview
```

---

## 🔒 Important Security Notes

1. **Never commit `.env` files** to Git
2. Add `.env` to `.gitignore`:
   ```
   # Environment variables
   .env
   .env.local
   .env.production
   ```
3. **Rotate API keys** regularly
4. Use **environment variables** for all sensitive data
5. Implement **rate limiting** on API endpoints

---

## 🚀 Deployment Options

### Backend Deployment:
- **Heroku** (Free tier available)
- **Railway.app** (Free tier)
- **Render** (Free tier)
- **AWS EC2** (Scalable)

### Frontend Deployment:
- **Vercel** (Free, optimized for React)
- **Netlify** (Free tier)
- **Firebase Hosting**

### Mobile App:
- **Google Play Store** (Android)
- **Apple App Store** (iOS)
- **TestFlight** (iOS beta testing)

---

## 📝 License
This project is open source and available for educational purposes.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---

## 📞 Support
For support or questions, feel free to open an issue on GitHub.

---

**Note**: This project is under active development. Features and setup instructions may be updated.
