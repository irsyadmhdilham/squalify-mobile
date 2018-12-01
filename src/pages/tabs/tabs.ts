import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";

import { DashboardPage } from "../dashboard/dashboard";
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { ApplicationsPage } from "../applications/applications";
import { InboxPage } from "../inbox/inbox";

import { Ids } from "../../functions/config";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends Ids {

  signedIn = false;
  tab1Root = HomePage;
  tab2Root = DashboardPage;
  tab3Root = ApplicationsPage;
  tab4Root = InboxPage;
  tab5Root = ProfilePage;

  constructor(public storage: Storage) {
    super(storage);
  }

  async ionViewWillLoad() {
    const userId = await this.userId();
    if (userId) {
      this.signedIn = true;
    }
  }

}
