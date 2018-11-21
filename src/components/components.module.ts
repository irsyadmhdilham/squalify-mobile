import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { loadingComponents } from './loading/loading-components'
import { FetchErrorComponent } from './fetch-error/fetch-error';
import { EmptyContentComponent } from './empty-content/empty-content';

@NgModule({
	declarations: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent
	]
})
export class ComponentsModule {}
