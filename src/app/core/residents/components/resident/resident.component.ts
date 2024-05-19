import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {ResidentService} from '../../services/resident.service';
import {Resident} from '../../models/resident';
import {TitleService} from '../../../services/title.service';

@Component({
  templateUrl: './resident.component.html'
})
export class ResidentComponent implements OnInit {
  protected title: string = null;

  resident: Resident;

  resident_id: number;

  constructor(private el: ElementRef, private resident$: ResidentService, title$: TitleService, private route$: ActivatedRoute) {
    title$.getTitle().subscribe(v => this.title = v);
  }

  ngOnInit(): void {
    // Replace(this.el);

    this.route$.params.subscribe(params => {
      // console.log(params);
      this.resident_id = +params['id'];

      // this.resident$.get(this.resident_id).pipe(first()).subscribe(res => {
      //   if (res) {
      //     this.resident = res;
      //   }
      // });
    });
  }
}
