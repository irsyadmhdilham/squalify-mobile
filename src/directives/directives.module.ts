import { NgModule } from '@angular/core';
import { CompMarginDirective } from './comp-margin/comp-margin';
import { NumStyleDirective } from './num-style/num-style';
import { TitleDirective } from './title/title';
import { HeaderButtonDirective } from './header-button/header-button';
@NgModule({
	declarations: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
    HeaderButtonDirective
    ],
	imports: [],
	exports: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
    HeaderButtonDirective
    ]
})
export class DirectivesModule {}
