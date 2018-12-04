import { NgModule } from '@angular/core';
import { CompMarginDirective } from './comp-margin/comp-margin';
import { NumStyleDirective } from './num-style/num-style';
import { TitleDirective } from './title/title';
import { HeaderButtonDirective } from './header-button/header-button';
import { ContentBgDirective } from './content-bg/content-bg';
import { ImgTitleDirective } from './img-title/img-title';
@NgModule({
	declarations: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
        HeaderButtonDirective,
        ContentBgDirective,
        ImgTitleDirective
    ],
	imports: [],
	exports: [
        CompMarginDirective,
        NumStyleDirective,
        TitleDirective,
        HeaderButtonDirective,
        ContentBgDirective,
        ImgTitleDirective
    ]
})
export class DirectivesModule {}
