import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from "@ionic-native/network";
import { CallNumber } from "@ionic-native/call-number";
import { Firebase } from "@ionic-native/firebase";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Camera } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { Badge } from "@ionic-native/badge";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Clipboard } from "@ionic-native/clipboard";

export const NativeModules = [
  StatusBar,
  SplashScreen,
  Network,
  CallNumber,
  Firebase,
  Deeplinks,
  Camera,
  FileTransfer,
  Badge,
  AndroidPermissions,
  LocalNotifications,
  Clipboard
];