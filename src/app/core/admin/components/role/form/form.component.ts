import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {GrantService} from '../../../services/grant.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {Subscription} from 'rxjs';

export interface GrantNodeInterface {
  key: number;
  title: string;
  enabled: boolean;
  level: number;
  identity: boolean;
  tree_level: boolean;
  tree_expand: boolean;
  children?: GrantNodeInterface[];
}

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  expandDataCache = {};

  spaces: Space[];

  selectedTab: number;

  $grantValue: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private grant$: GrantService,
    private space$: SpaceService,
    private _el: ElementRef
  ) {
    super();
  }

  collapse(array: GrantNodeInterface[], data: GrantNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.tree_expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): GrantNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({...root, tree_level: 0, tree_expand: false});

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], tree_level: node.tree_level + 1, tree_expand: false, tree_parent: node});
        }
      }
    }

    return array;
  }

  visitNode(node: GrantNodeInterface, hashMap: object, array: GrantNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.selectedTab = 0;

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      default: [false, Validators.required],
      space_id: [null],
      space_default: [false, Validators.required],
      grants: [[]]
    });

    this.$grantValue = this.form.get('grants').valueChanges.subscribe(next => {
      if (next) {
        next.forEach(item => {
          this.expandDataCache[item.key] = this.convertTreeToList(item);
        });
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });

    this.postSubmit = (data: any) => {
      const invalid_el = this._el.nativeElement.querySelector(':not(form).ng-invalid');
      if (invalid_el) {
        const tab_el = invalid_el.closest('.ant-tabs-tabpane');
        this.selectedTab = [].indexOf.call(tab_el.parentElement.querySelectorAll('.ant-tabs-tabpane'), tab_el);
      }
    };
  }

  before_set_form_data(): void {
    if (!this.edit_mode) {
      this.grant$.all().pipe(first()).subscribe(res => {
        if (res) {
          this.form.get('grants').setValue(res);
          this.$grantValue.unsubscribe();
        }
      });
    }
  }

  after_set_form_data(): void {
    this.$grantValue.unsubscribe();
  }

  before_submit(): void {
    const grant_data = {};
    Object.keys(this.expandDataCache).forEach(key => {
      this.expandDataCache[key].forEach(grant => {
        const grant_info = {};

        if (grant.hasOwnProperty('enabled')) {
          grant_info['enabled'] = grant['enabled'];
        }
        if (grant.hasOwnProperty('level')) {
          grant_info['level'] = grant['level'];
        }
        if (grant.hasOwnProperty('identity')) {
          grant_info['identity'] = grant['identity'];
        }

        if (!(Object.keys(grant_info).length === 0 && grant_info.constructor === Object)) {
          grant_data[grant['key']] = grant_info;
        }
      });
    });

    this.form.get('grants').setValue(grant_data);
  }

}
