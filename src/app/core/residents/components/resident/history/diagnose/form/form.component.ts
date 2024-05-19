import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {Diagnosis} from '../../../../../models/diagnosis';
import {DiagnosisService} from '../../../../../services/diagnosis.service';
import {ActivatedRoute} from '@angular/router';
import {DiagnoseType} from '../../../../../models/diagnose-type.enum';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as DiagnosisFormComponent} from '../../../../diagnosis/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  types: { id: DiagnoseType, name: string }[];

  diagnoses: Diagnosis[];
  resident_id: number;

  constructor(
    private formBuilder: FormBuilder,
    private diagnosis$: DiagnosisService,
    private route$: ActivatedRoute,
    private modal$: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      type: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.maxLength(512)])],

      diagnose_id: [null, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.subscribe('list_diagnosis');

    // TODO: review
    this.types = [
      {id: DiagnoseType.PRIMARY, name: 'Primary'},
      {id: DiagnoseType.SECONDARY, name: 'Secondary'},
      {id: DiagnoseType.OTHER, name: 'Other'}
    ];
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_diagnosis':
        this.$subscriptions[key] = this.diagnosis$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.diagnoses = res;
          }
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'diagnose':
        this.create_modal(
          this.modal$,
          DiagnosisFormComponent,
          data => this.diagnosis$.add(data),
          data => {
            this.$subscriptions[key] = this.diagnosis$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.diagnoses = res;
                this.form.get('diagnose_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      default:
        break;
    }
  }

}
