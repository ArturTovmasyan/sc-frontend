import { Component, ElementRef } from '@angular/core';
import { EventTargetInterruptSource, Idle } from '@ng-idle/core';
import { AuthService } from './shared';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private authService: AuthService,
                private element: ElementRef,
                private idle: Idle
    ) {
        idle.setIdle(3600);
        idle.setTimeout(15);
        idle.setInterrupts([
            new EventTargetInterruptSource(this.element.nativeElement,
                'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
            )
        ]);
        idle.onTimeout.subscribe(() => {
            authService.logout();
            idle.watch();
        });
        idle.watch();
    }

    ngOnInit() {
    }
}
