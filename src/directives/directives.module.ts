import { NgModule } from '@angular/core';
import { CompMarginDirective } from './comp-margin/comp-margin';
import { NumStyleDirective } from './num-style/num-style';
@NgModule({
	declarations: [CompMarginDirective,
    NumStyleDirective],
	imports: [],
	exports: [CompMarginDirective,
    NumStyleDirective]
})
export class DirectivesModule {}
