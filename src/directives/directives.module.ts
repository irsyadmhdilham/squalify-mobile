import { NgModule } from '@angular/core';
import { CompMarginDirective } from './comp-margin/comp-margin';
import { NumStyleDirective } from './num-style/num-style';
import { TitleDirective } from './title/title';
import { HeaderButtonDirective } from './header-button/header-button';
import { ContentBgDirective } from './content-bg/content-bg';
@NgModule({
	declarations: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
    HeaderButtonDirective,
    ContentBgDirective
    ],
	imports: [],
	exports: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
    HeaderButtonDirective,
    ContentBgDirective
    ]
})
export class DirectivesModule {}
