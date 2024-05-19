// import {GridComponent} from '../../../../shared/components/grid/grid.component';
// import {UserService} from '../../services/user.service';
// import {Component} from '@angular/core';
// import {TitleService} from '../../../services/title.service';
// import {NzModalService} from 'ng-zorro-antd';
//
// @Component({
//   templateUrl: '../../../../shared/components/grid/grid.component.html',
//   styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
//   providers: [UserService]
// })
// export class UsersComponent {}
//
// // extends GridComponent {
// //   constructor(user$: UserService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
// //     super(title$, modal$);
// //
// //     this.name = 'users';
// //
// //     this.load_grid_fields = () => {
// //       return user$.options();
// //     };
// //
// //     this.load_grid = (page: number,
// //                       per_page: number,
// //                       sort: { key: string, value: string }[],
// //                       filter: { [id: string]: { condition: number, value: any[] } }) => {
// //       return user$.list(page, per_page, sort, filter);
// //     };
// //
// //     this.load_pdf = (callback: any) => {
// //       return user$.pdf(callback);
// //     };
// //   }
// // }
