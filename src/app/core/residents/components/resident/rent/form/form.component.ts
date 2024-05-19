import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {PaymentSource} from '../../../../models/payment-source';
import {PaymentSourceService} from '../../../../services/payment-source.service';
import {ActivatedRoute} from '@angular/router';
import {RentType} from '../../../../models/rent-type.enum';
import {ValidationPatterns} from '../../../../../../shared/constants/validation.patterns';
import {RoomType} from '../../../../models/room-type.enum';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  source_selector: number = null;

  payment_sources: PaymentSource[];
  types: { id: RentType, name: string }[];
  resident_id: number;

  sources: { id: number, amount: number }[] = [];


  constructor(private formBuilder: FormBuilder, private payment_source$: PaymentSourceService, private route$: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],

      type: ['', Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.max(512)])],
      amount: [0, Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.RENT_AMOUNT)])],

      start: [new Date(), Validators.required],
      end: [new Date()],

      source: this.formBuilder.array([]),

      resident_id: [this.resident_id, Validators.required]
    });

    this.payment_source$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.payment_sources = res;
        this.payment_sources.forEach(v => v.disabled = false);

        this.after_set_form_data();
      }
    });

    this.types = [
      {id: RentType.MONTHLY, name: 'Monthly'},
      {id: RentType.WEEKLY, name: 'Weekly'},
      {id: RentType.DAILY, name: 'Daily'},
      {id: RentType.HOURLY, name: 'Hourly'}
    ];
  }

  add_source() {
    const source = this.payment_sources.filter(item => item.id === this.source_selector).pop();
    if (source) {
      source.disabled = true;

      this.add_field('source', {id: source.id, amount: 0});

      this.source_selector = null;
    }
  }

  remove_source(i: number) {
    const control = this.get_form_array('source').controls[i];

    if (control) {
      const source = this.payment_sources.filter(item => item.id === control.get('id').value).pop();
      source.disabled = false;
      this.remove_field('source', i);
    }
  }

  remaining() {
    const controls = this.get_form_array('source').controls;

    return this.form.get('amount').value - Object.keys(controls).reduce((previous, key) => {
      return controls[key].get('amount').value + previous;
    }, 0);
  }

  public get_form_array_skeleton(key: string): FormGroup {
    switch (key) {
      case 'source':
        return this.formBuilder.group({
          id: [null, Validators.required],
          amount: [null, Validators.required],
        });
      default:
        return null;
    }
  }

  public after_set_form_data(): void {
    const controls = this.get_form_array('source').controls;

    if (controls && this.payment_sources) {
      Object.keys(controls).forEach(idx => {
        const source = this.payment_sources.filter(item => item.id === controls[idx].get('id').value).pop();
        source.disabled = true;
      });
    }
  }

  public get_title(idx: number) {
    const control = this.get_form_array('source').controls[idx];

    let source = null;

    if (control && this.payment_sources) {
      source = this.payment_sources.filter(item => item.id === control.get('id').value).pop();
    }

    return source ? source.title : '';
  }
}
