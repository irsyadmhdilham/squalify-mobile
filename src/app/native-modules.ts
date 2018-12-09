import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from "@ionic-native/network";
import { ImagePicker } from "@ionic-native/image-picker";
import { CallNumber } from "@ionic-native/call-number";

export const NativeModules = [
  StatusBar,
  SplashScreen,
  Network,
  ImagePicker,
  CallNumber
];