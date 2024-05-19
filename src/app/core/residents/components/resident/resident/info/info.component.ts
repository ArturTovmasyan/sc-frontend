import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {AuthGuard} from '../../../../../guards/auth.guard';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {GroupType} from '../../../../models/group-type.enum';
import {GroupHelper} from '../../../../helper/group-helper';
import {DateHelper} from '../../../../../../shared/helpers/date-helper';
import {ResidentService} from '../../../../services/resident.service';
import {ResidentAdmissionService} from '../../../../services/resident-admission.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ReportService} from '../../../../services/report.service';
import {Resident, ResidentState} from '../../../../models/resident';
import {ResidentAdmission} from '../../../../models/resident-admission';
import {FormComponent} from '../form/form.component';
import {ImageEditorComponent} from './img-editor/image-editor.component';
import {ButtonBarComponent} from '../../../../../../shared/components/modal/button-bar.component';

@Component({
  selector: 'app-resident-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  GroupType = GroupType;
  ResidentState = ResidentState;
  _FormComponent = FormComponent;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  protected _btnBar: ButtonBarComponent;

  resident: Resident;
  admission: ResidentAdmission;
  state: ResidentState = null;
  today: Date = DateHelper.newDate();
  resident_id: number;

  private $subscriptions: { [key: string]: Subscription; };

  modal_callback: (data) => void = (data) => {
    this.resident$.get(this.resident_id).pipe(first()).subscribe(next => {
      if (next) {
        this.resident = next;
        this.resident_id = this.resident.id;
        this.residentSelector$.resident.next(this.resident.id);
      }
    });
  };

  remove_modal_callback: (data) => void = (data) => {
    this.router$.navigate(['/residents/active']);
  };

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private router$: Router,
    private modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService,
    private admission$: ResidentAdmissionService,
    private report$: ReportService,
    public resident$: ResidentService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string, params?: any) {
    this.unsubscribe(key);
    switch (key) {
      case 'get_resident':
        this.$subscriptions[key] = this.resident$.get(this.resident_id).pipe(first()).subscribe(res => {
          if (res) {
            this.resident = res;
          } else {
            this.resident = null;
          }
        }, error => {
          this.resident = null;
        });
        break;
      case 'get_resident_state':
        this.$subscriptions[key] = this.resident$.state(this.resident_id).pipe(first()).subscribe(res => {
          if (res) {
            this.state = res;
          }
        });
        break;
      case 'get_admission_active':
        this.$subscriptions[key] = this.admission$.active(this.resident_id).pipe(first()).subscribe(res => {
          if (res != null && !Array.isArray(res)) {
            this.admission = res;

            this.residentSelector$.type.next(this.admission.group_type);
            this.residentSelector$.group.next(GroupHelper.get_group_id(this.admission));
          } else {
            this.admission = null;

            this.subscribe('get_admission_last');
          }
        }, error => {
          this.admission = null;
        });
        break;
      case 'get_admission_last':
        this.$subscriptions[key] = this.resident$.last_admission(this.resident_id).pipe(first()).subscribe(last_admission => {
          if (last_admission) {
            this.admission = last_admission;

            this.residentSelector$.type.next(last_admission.group_type);
            this.residentSelector$.group.next(GroupHelper.get_group_id(last_admission));
          } else {
            this.residentSelector$.type.next(null);
            this.residentSelector$.group.next(null);
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.resident_id = next;
            this.subscribe('get_resident');
            this.subscribe('get_resident_state');
            this.subscribe('get_admission_active');
          }
        });
        break;
      default:
        break;
    }
  }

  show_modal_image_editor(): void {
    const modal = this.modal$.create_sub(ImageEditorComponent);
    modal.modal_callback = (res) => {
      window.location.reload();
    };

    const result = {
      id: this.residentSelector$.resident.value,
      photo: this.resident.image
    };

    modal.create(data => this.resident$.put_photo(data), result, null);
  }

  show_report(group: string, alias: string, params: any = {}): void {
    this.report$.report(
      group,
      alias,
      'pdf',
      {group: this.residentSelector$.type.value, resident_id: this.residentSelector$.resident.value, ...params},
      () => {
      },
      (error) => {
      }
    );
  }

  addIfHasPermission(permission: string, level: number = 1) {
    return this.auth_$.checkPermission([permission], level);
  }
}
