# Patient Decisions React Native Application #

## To develop the app ##
1. Open Visual Studio Code and open the patient-decisions/react-native-app folder

## To Run the app ##
1. Install Android studio. We need this to run Android Virtual Devices (Emulators). 
2. Add an environment variable ANDROID_HOME=~/Library/Android/sdk (you can add this in your .bash_profile) on a Mac.  On linux set that environmental variable to ANDROID_HOME=/home/YOUR_USERNAME/Android/Sdk
2. Install node, the easiest way is to [install nvm](https://github.com/nvm-sh/nvm#installation-and-update).
3. In the project folder run npm install
4. In the project folder run npm install -g react-native-cli
5. Start an android virtual device (and create your first virtual item) from Android Studio -> Tools -> AVD Manager.  Make the device be a 10.1" wxga tablet, and choose android pie 9.0 as the device configuration.
6. Run react-native run-android


