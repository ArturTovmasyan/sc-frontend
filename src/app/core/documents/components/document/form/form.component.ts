import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Facility} from '../../../../residents/models/facility';
import {FileModel} from '../../../../models/file-model';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FacilityService} from '../../../../residents/services/facility.service';
import {StringUtil} from '../../../../../shared/utils/string-util';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../services/category.service';
import {FormComponent as CategoryFormComponent} from '../../category/form/form.component';
import {Role} from '../../../../models/role';
import {RoleService} from '../../../../admin/services/role.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  roles: Role[];
  categories: Category[];
  facilities: Facility[];

  show_facilities: boolean;

  @ViewChild('file', {static: true}) el_file: ElementRef;

  files: FileModel[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private role$: RoleService,
    private facility$: FacilityService,
    private category$: CategoryService
  ) {
    super(modal$);

    this.modal_map = [
      {key: 'category', component: CategoryFormComponent}
    ];

    this.show_facilities = true;
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

      notification: [false, Validators.compose([Validators.required])],
      emails: [[]],

      category_id: [null, Validators.compose([Validators.required])],

      facilities: [[], Validators.compose([Validators.required])],
      facilities_all: [false, Validators.required],

      roles: [[], Validators.compose([Validators.required])]

    });

    this.subscribe('list_category');
    this.subscribe('list_role');
    this.subscribe('list_facility');
    this.subscribe('vc_facilities_all');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_role':
        this.$subscriptions[key] = this.role$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;
          }
        });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      case 'list_category':
        this.$subscriptions[key] = this.category$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.categories = res;

            if (params) {
              this.form.get('category_id').setValue(params.category_id);
            }
          }
        });
        break;
      case 'vc_facilities_all':
        this.$subscriptions[key] = this.form.get('facilities_all').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('facilities').setValue([]);
            this.show_facilities = false;
          } else {
            this.show_facilities = true;
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
      model.file_name = StringUtil.truncate(file.name, 25);
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
