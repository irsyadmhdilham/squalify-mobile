import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {

  postType: string = 'sales closed';
  @ViewChild('likeIcon') likeIcon: ElementRef;
  name: string = 'Irsyad Mhd Ilham';
  totalSales: number = 340000;
  monthlySales: number = 1200000;
  date: Date = new Date();
  location: string = 'Petaling Jaya';
  taggedUsers: string[] = ['Amir Hasnan', 'Zafizi Zain', 'Yulam'];
  liked = false;
  comments: number = 10;
  likes: number = 20;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }
  
  dateDisplay() {
    const year = this.date.getFullYear(),
          month = this.date.getMonth(),
          date = this.date.getDate();
    const currentYear = new Date().getFullYear(),
          currentMonth = new Date().getMonth(),
          currentDate = new Date().getDate();
    if (currentYear === year && currentMonth === month) {
      if (currentDate === date) {
        return {
          text: 'Today'
        };
      } else {
        return { text: false };
      }
    } else {
      return { text: false };
    }
  }

  like() {
    this.likeIcon.nativeElement.classList.add('like-button');
    setTimeout(() => {
      this.likeIcon.nativeElement.classList.remove('like-button');
    }, 500);
    setTimeout(() => {
      if (this.liked) {
        this.liked = false;
      } else {
        this.liked = true;
      }
    }, 250);
  }

}
