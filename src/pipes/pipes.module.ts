import { NgModule } from '@angular/core';
import { NumCommasPipe } from './num-commas/num-commas';
import { ChatMembersFilterPipe } from './chat-members-filter/chat-members-filter';
import { InboxDuplicatePipe } from './inbox-duplicate/inbox-duplicate';
@NgModule({
	declarations: [
        NumCommasPipe,
        ChatMembersFilterPipe,
        InboxDuplicatePipe
    ],
	imports: [],
	exports: [
        NumCommasPipe,
        ChatMembersFilterPipe,
        InboxDuplicatePipe
    ]
})
export class PipesModule {}
