import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
})
export class BrandAddComponent implements OnInit {

  brandForm: FormGroup;
  nameValidationRegex: any;
  maxFileSize;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
  showloader = false;
  imageError: string;
  isImageSaved = false;
  cardImageBase64: string = null;
  editorError: string;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.maxFileSize = this.dataService.maxFileSize;
    this.brandForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      brandname: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)]),
      branddesc: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  ngOnInit(): void { }

  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // -- Size Filter Bytes
      const maxSize = this.maxFileSize;
      const allowedTypes = ['image/png', 'image/jpeg'];
      const maxHeight = 15200;
      const maxWidth = 25600;

      if (fileInput.target.files[0].size > maxSize) {
        this.imageError = 'Maximum size allowed is ' + maxSize / 1000 + 'KB';
        return false;
      }

      if (!_.includes(allowedTypes, fileInput.target.files[0].type)) {
        this.imageError = 'Only images are allowed(JPG, PNG)';
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const height = 'height';
          const width = 'height';
          const imgHeight = rs.currentTarget[height];
          const imgWidth = rs.currentTarget[width];
          // console.log('imgHeight, imgWidth: ', imgHeight, imgWidth);

          if (imgHeight > maxHeight && imgWidth > maxWidth) {
            this.imageError = 'Maximum dimentions allowed ' + maxHeight + '*' + maxWidth + 'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            // console.log('this.cardImageBase64: ', this.cardImageBase64);
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(element): void {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    element.value = '';
  }

  editorChangeEvent(input: string): void {
    // console.log('editorChangeEvent input: ', input);
    this.editorError = '';
    if (input.length === 0) {
      this.editorError = 'Brand description is required.';
    }
  }

  async submitBrand(): Promise<void> {
    if (this.brandForm.valid && this.cardImageBase64 !== null) {
      const url = 'brand/add';
      const payload = {
        name: this.brandForm.value.brandname,
        image: this.cardImageBase64,
        description: this.brandForm.value.branddesc,
      };
      // console.log('submitBrand payload: ', payload);
      this.showloader = true;
      this.apiService.sendHttpCallWithToken(payload, url, 'post').subscribe((response) => {
        console.log('submitBrand response: ' , response);
        this.showloader = false;
        if (response.status === 200) {
          this.dataService.showSuccess(response.message);
          this.brandForm.reset();
          this.cardImageBase64 = null;
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to add brand');
        }
      }, (error) => {
        console.log('submitBrand error: ' , error);
        this.showloader = false;
        if (error.message) {
          this.dataService.showError(error.message);
        } else {
          this.dataService.showError('Unable to add brand');
        }
      });
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.brandForm.controls).forEach((field) => {
        const control = this.brandForm.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

  resetForm(element): void {
    this.brandForm.patchValue({
      brandname: '',
      branddesc: '',
    });

    this.cardImageBase64 = null;
    this.isImageSaved = false;
    element.value = '';
  }

}
