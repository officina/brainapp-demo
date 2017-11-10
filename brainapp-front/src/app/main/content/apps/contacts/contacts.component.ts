import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContactsService } from './contacts.service';
import { fuseAnimations } from '../../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { FuseContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import { MatDialog } from '@angular/material';

@Component({
    selector     : 'fuse-contacts',
    templateUrl  : './contacts.component.html',
    styleUrls    : ['./contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseContactsComponent implements OnInit
{
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    dialogRef: any;

    constructor(
        private contactsService: ContactsService,
        public dialog: MatDialog
    )
    {
        this.searchInput = new FormControl('');
    }

    newContact()
    {
        this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

                this.contactsService.updateContact(response.getRawValue());

            });

    }

    ngOnInit()
    {

        this.contactsService.onSelectedContactsChanged
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.contactsService.onSearchTextChanged.next(searchText);
            });
    }

}
