
import { Component, OnDestroy } from '@angular/core';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'loading',
    template: `<div id="pause" class="d-flex align-items-center justify-content-center">
					<div id="spinner"></div>
                </div>`,
})

export class LoadingComponent {

}
