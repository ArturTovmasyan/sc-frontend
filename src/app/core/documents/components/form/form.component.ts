import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../services/space.service';
import {AuthGuard} from '../../../guards/auth.guard';
import {Space} from '../../../models/space';
import {FileModel} from '../../../models/file-model';
import {FacilityService} from '../../../residents/services/facility.service';
import {Facility} from '../../../residents/models/facility';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];
  facilities: Facility[];

  @ViewChild('file') el_file: ElementRef;

  files: FileModel[];

  constructor(
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super();
  }

  ngOnInit(): void {
    this.files = [
      {file_name: '', size_exceed: false, form_item: 'file', element: this.el_file},
    ];

    this.form = this.formBuilder.group({
      id: [''],

      title: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      description: ['', Validators.compose([Validators.maxLength(512)])],

      file: [null],

      facilities: [[], Validators.compose([])],
    });

    this.subscribe('list_facility');

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;

            if (params) {
              /// ???
              this.form.get('facility_id').setValue(params.facility_id);
            }
          }
        });
        break;
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      default:
        break;
    }
  }

  onFileChange(model: FileModel, $event) {
    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length > 0) {
      const file = $event.target.files[0];
      model.file_name = FileModel.truncate(file.name, 25);
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result as string;
          const suffix = result.substr(-2);
          const y = suffix === '==' ? 2 : (suffix === '=' ? 1 : 0);

          const max_file_size = (10 * 1024 * 1024 + 32);
          const file_size = (result.length * (3 / 4)) - y;

          if (file_size > max_file_size) {
            model.size_exceed = true;
            this.form.get(model.form_item).setValue(null);
          } else {
            model.size_exceed = false;
            this.form.get(model.form_item).setValue(reader.result);
          }
        }
      };
      (model.element.nativeElement as HTMLInputElement).value = null;
    }

    return false;
  }

  select_file(model: FileModel) {
    (model.element.nativeElement as HTMLInputElement).click();
  }

  clear_file(model: FileModel) {
    model.file_name = null;
    model.size_exceed = false;
    this.form.get(model.form_item).setValue(null);
  }

}
