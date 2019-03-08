import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { loadingComponents } from './loading/loading-components'
import { FetchErrorComponent } from './fetch-error/fetch-error';
import { EmptyContentComponent } from './empty-content/empty-content';
import { NotFoundComponent } from './not-found/not-found';

@NgModule({
	declarations: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent,
		NotFoundComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent,
		NotFoundComponent
	]
})
export class ComponentsModule {}
