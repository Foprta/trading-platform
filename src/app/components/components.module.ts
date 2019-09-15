import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatMenuModule,
} from '@angular/material';

const MAT_MODULES = [
  MatCardModule,
  MatGridListModule,
  MatTabsModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatListModule,
  MatDialogModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatRadioModule,
  MatNativeDateModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatMenuModule,
];

@NgModule({
  declarations: [],
  exports: [
    ...MAT_MODULES,
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
