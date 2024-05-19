import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';

@Component({
  selector: 'app-resident-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent {
  constructor() {
  }
}
