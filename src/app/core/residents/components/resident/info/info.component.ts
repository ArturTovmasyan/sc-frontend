import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';

@Component({
  selector: 'app-resident-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  resident: Resident;

  resident_id: number;

  constructor(private el: ElementRef, private resident$: ResidentService, private route$: ActivatedRoute) {
  }

  ngOnInit(): void {
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
