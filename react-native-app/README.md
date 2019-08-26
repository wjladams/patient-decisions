# Patient Decisions React Native Application #

## To develop the app ##
1. Open Visual Studio Code and open the patient-decisions/react-native-app folder

## To Run the app in the emulator ##
1. Install Android studio. We need this to run Android Virtual Devices (Emulators). 
2. Add an environment variable ANDROID_HOME=~/Library/Android/sdk (you can add this in your .bash_profile) on a Mac.  On linux set that environmental variables 
```
export ANDROID_HOME=/home/USERNAME/Android/Sdk
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
```
2. Install node, the easiest way is to [install nvm](https://github.com/nvm-sh/nvm#installation-and-update).
3. In the project folder run npm install
4. In the project folder run npm install -g react-native-cli
5. Start an android virtual device (and create your first virtual item) from Android Studio -> Tools -> AVD Manager.  Make the device be a 10.1" wxga tablet, and choose android pie 9.0 as the device configuration.
6. Run react-native run-android

## Building apk ##
1. From react-native-app folder run "npm install"
2. Then run "npm run build"
3. This will produce an apk in "react-native-app/android/app/build/outputs/apk/release" folder

## Installing apk on your phone ##
1. Go to settings and search for "Installing apps from unknow sources" 
2. On older phone you have to toggle a switch to allow installing apps from unknown sources. On newer phones you have to say which apps you are going to download and install the app. You can either choose chrome or gmail depending on where you are going to download the apk from.
3. If you are downloading from the browser go to https://github.com/wjladams/patient-decisions/tree/master/react-native-app/android/app/build/outputs/apk/release and download app-release.apk
4. Open it and follow the instructions.
