import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { loadingComponents } from './loading/loading-components'
import { FetchErrorComponent } from './fetch-error/fetch-error';

@NgModule({
	declarations: [
		...loadingComponents,
    FetchErrorComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
		...loadingComponents,
    FetchErrorComponent
	]
})
export class ComponentsModule {}
