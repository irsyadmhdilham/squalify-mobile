import { NgModule } from '@angular/core';
import { CompMarginDirective } from './comp-margin/comp-margin';
import { NumStyleDirective } from './num-style/num-style';
import { TitleDirective } from './title/title';
@NgModule({
	declarations: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective
    ],
	imports: [],
	exports: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective
    ]
})
export class DirectivesModule {}
