// import {GridComponent} from '../../../../shared/components/grid/grid.component';
// import {RoleService} from '../../services/role.service';
// import {Component} from '@angular/core';
// import {TitleService} from '../../../services/title.service';
// import {NzModalService} from 'ng-zorro-antd';
// // import {RoleFormComponent} from './form/form.component';
// import {Role} from '../../../models/role';
//
// @Component({
//   templateUrl: '../../../../shared/components/grid/grid.component.html',
//   styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
//   providers: [RoleService]
// })
// export class RolesComponent {}
// // extends GridComponent {
// //   constructor(role$: RoleService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
// //     super(title$, modal$);
// //
// //     this.name = 'roles';
// //
// //     this.form_component = RoleFormComponent;
// //
// //     this.load_grid_fields = () => {
// //       return role$.options();
// //     };
// //
// //     this.load_grid = (page: number,
// //                       per_page: number,
// //                       sort: { key: string, value: string }[],
// //                       filter: { [id: string]: { condition: number, value: any[] } }) => {
// //       return role$.list(page, per_page, sort, filter);
// //     };
// //
// //     this.load_pdf = (callback: any) => {
// //       return role$.pdf(callback);
// //     };
// //
// //     this.load_data = (id: number) => {
// //       return role$.get(id);
// //     };
// //
// //     this.add_data = (data: any) => {
// //       return role$.add(data);
// //     };
// //
// //     this.edit_data = (data: any) => {
// //       return role$.edit(data);
// //     };
// //
// //     this.remove_data = (ids: number[]) => {
// //       return role$.removeBulk(ids);
// //     };
// //
// //     this.set_form_data = (form: any, result: any) => {
// //       const data: Role = <Role> result;
// //
// //       const space = data.space ? data.space.id : '';
// //       const permissions = data.permissions.map(v => v.id);
// //
// //       form.setValue(data);
// //       form.patchValue({'permissions': permissions});
// //       form.patchValue({'space': space});
// //     };
// //   }
// // }
