import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  @Input() page;
  @Output() setTitle:EventEmitter<number>=new EventEmitter<number>();
  @Output() closeEvent=new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  close(){
    this.closeEvent.emit();
  }
  prev(){
    this.page-=1;
    this.setTitle.emit(this.page);

  }
  next(){

    this.page+=1;
    if(this.page>4)
    {
    this.page=0;
    this.close();
    }else
    this.setTitle.emit(this.page);
  }
}
