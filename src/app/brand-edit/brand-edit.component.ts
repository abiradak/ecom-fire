import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.css']
})
export class BrandEditComponent implements OnInit {

  brandData: any;
  brandId: string = null;
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
  isImageChanged = false;
  cardImageBase64: string = null;
  editorError: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

  ngOnInit(): void {
    this.brandId = this.activatedRoute.snapshot.paramMap.get('brandId');
    // console.log('ngOnInit this.brandId: ', this.brandId);
    if (this.brandId.length === 0) {
      this.dataService.showError('Brand details not found.'); // --- Display error message
      this.router.navigate(['/brand-list']);
    } else {
      this.getBrand();
    }
  }

  async getBrand(): Promise<void> {
    const url = 'brand/' + this.brandId;
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getBrand response: ' , response);
      this.showloader = false;
      if (response.brand.data) {
        this.brandData = response.brand.data;
        this.populateBrandData();
      } else {
        if (response.message) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('No brand found!');
        }
        // this.router.navigate(['/brand-list']);
      }
      // console.log('this.brandData: ', this.brandData);
    }, (error) => {
      console.log('getBrand error: ' , error);
      this.showloader = false;
      if (error.message) {
        this.dataService.showError(error.message);
      } else {
        this.dataService.showError('Unable to load brand details!');
      }
      this.router.navigate(['/brand-list']);
    });
  }

  populateBrandData(): void {
    if (this.brandData.image !== null || this.brandData.image !== '') {
      this.cardImageBase64 = this.brandData.image;
      this.isImageSaved = true;
    }
    this.brandForm.patchValue({
      brandname: this.brandData.name,
      branddesc: this.brandData.description,
    });
  }

  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    this.cardImageBase64 = this.brandData.image;
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
            this.isImageChanged = true;
            // console.log('this.cardImageBase64: ', this.cardImageBase64);
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage(element): void {
    if (this.brandData.image !== null || this.brandData.image !== '') {
      this.cardImageBase64 = this.brandData.image;
      this.isImageSaved = true;
      this.isImageChanged = false;
      element.value = '';
    } else {
      this.cardImageBase64 = null;
      this.isImageSaved = false;
      this.isImageChanged = false;
      element.value = '';
    }
  }

  editorChangeEvent(input: string): void {
    // console.log('editorChangeEvent input: ', input);
    this.editorError = '';
    if (input.length === 0) {
      this.editorError = 'Brand description is required.';
    }
  }

  async submitBrand(image): Promise<void> {
    if (this.brandForm.valid) {
      const url = 'brand/edit/' + this.brandId;
      const payload = {
        name: this.brandForm.value.brandname,
        image: this.cardImageBase64,
        description: this.brandForm.value.branddesc,
      };
      if (this.cardImageBase64 === null) {
        delete payload.image;
      }
      this.showloader = true;
      // console.log('submitBrand payload: ', payload);
      this.apiService.sendHttpCallWithToken(payload, url, 'patch').subscribe((response) => {
        // console.log('submitBrand response: ' , response);
        this.showloader = false;
        if (response.status === 200) {
          this.dataService.showSuccess(response.message);
          this.brandData.image = this.cardImageBase64;
          this.brandData.name = this.brandForm.value.brandname;
          this.brandData.description = this.brandForm.value.branddesc;
          this.isImageChanged = false;
          image.value = '';
        } else if (response.status === 400) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('Unable to edit brand');
        }
      }, (error) => {
        console.log('submitBrand error: ' , error);
        this.showloader = false;
        if (error.message) {
          this.dataService.showError(error.message);
        } else {
          this.dataService.showError('Unable to edit brand');
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
      brandname: this.brandData.name,
      branddesc: this.brandData.description,
    });

    if (this.isImageChanged) {
      this.cardImageBase64 = this.brandData.image;
      this.isImageChanged = false;
      element.value = '';
    }
  }

}
