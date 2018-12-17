import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from "@ionic-native/network";
import { ImagePicker } from "@ionic-native/image-picker";
import { CallNumber } from "@ionic-native/call-number";
import { Firebase } from "@ionic-native/firebase";
import { Deeplinks } from "@ionic-native/deeplinks";

export const NativeModules = [
  StatusBar,
  SplashScreen,
  Network,
  ImagePicker,
  CallNumber,
  Firebase,
  Deeplinks
];