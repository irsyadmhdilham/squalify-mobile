import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { loadingComponents } from './loading/loading-components'
import { FetchErrorComponent } from './fetch-error/fetch-error';
import { EmptyContentComponent } from './empty-content/empty-content';
import { EditScheduleComponent } from './edit-schedule/edit-schedule';

@NgModule({
	declarations: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent,
    EditScheduleComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
		...loadingComponents,
    FetchErrorComponent,
    EmptyContentComponent,
    EditScheduleComponent
	]
})
export class ComponentsModule {}
