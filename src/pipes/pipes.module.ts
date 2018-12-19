import { NgModule } from '@angular/core';
import { NumCommasPipe } from './num-commas/num-commas';
import { ChatMembersFilterPipe } from './chat-members-filter/chat-members-filter';
@NgModule({
	declarations: [NumCommasPipe,
    ChatMembersFilterPipe],
	imports: [],
	exports: [NumCommasPipe,
    ChatMembersFilterPipe]
})
export class PipesModule {}
