import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  nameValidationRegex: any;
  priceValidationRegex: any;
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
  categoryList =  [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.priceValidationRegex = this.dataService.priceValidationRegex;

    this.productForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      productname: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)]),
      productdesc: new FormControl('', [Validators.required, Validators.minLength(2)]),
      productprice: new FormControl('', [Validators.required, Validators.pattern(this.priceValidationRegex)]),
      productvolume: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
    this.getCategoryFromApi();
  }

  // async getCategoryFromApi(): Promise<void> {
  //   const url = 'catagories';
  //   this.showloader = true;
  //   this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
  //     // console.log('getCategoryFromApi response: ' , response);
  //     this.showloader = false;
  //     if (response.category && response.category.length > 0) {
  //       this.categoryList = response.category;
  //     } else {
  //       this.categoryList = [];
  //       this.dataService.showError('No category found!');
  //     }
  //     // console.log('this.categoryList: ', this.categoryList);
  //   }, (error) => {
  //     console.log('getCategoryFromApi error: ' , error);
  //     this.showloader = false;
  //     this.dataService.showError('Unable to load category list!');
  //   });
  // }

  async getCategoryFromApi(): Promise<void> {
    const url = 'catagories';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      console.log('getProductFromApi response: ' , response);
      this.showloader = false;
      this.categoryList = [];
      if (response.category && response.category.length > 0) {
        response.category.forEach(element => {
          this.categoryList.push({
            id: element.id,
            name: element.data.name
          });
        });
      } else {
        this.dataService.showError('No category found!');
      }
      // console.log('this.productList: ', this.productList);
    }, (error) => {
      console.log('getProductFromApi error: ' , error);
      this.showloader = false;
      this.dataService.showError('Unable to load category list!');
    });
  }


  onItemSelect(item: any): void  {
    // console.log('onItemSelect: ', item);
    this.selectedItems.push(item);
    // console.log('onItemSelect this.selectedItems: ', this.selectedItems);
  }

  onItemDeSelect(item: any): void  {
    // console.log('onItemDeSelect: ', item);
    this.selectedItems = this.selectedItems.filter(data => data.id !== item.id);
    // console.log('onItemDeSelect this.selectedItems: ', this.selectedItems);
  }

  onSelectAll(items: any): void  {
    // console.log('onSelectAll: ', items);
    this.selectedItems = items;
    // console.log('onSelectAll this.selectedItems: ', this.selectedItems);
  }

  onDeSelectAll(items: any): void  {
    // console.log('onDeSelectAll: ', items);
    this.selectedItems = [];
    // console.log('onDeSelectAll this.selectedItems: ', this.selectedItems);
  }


  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // -- Size Filter Bytes
      const maxSize = 20971520;
      const allowedTypes = ['image/png', 'image/jpeg'];
      const maxHeight = 15200;
      const maxWidth = 25600;

      if (fileInput.target.files[0].size > maxSize) {
        this.imageError = 'Maximum size allowed is ' + maxSize / 1000 + 'Mb';
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
      this.editorError = 'Product description is required.';
    }
  }

  async submitProduct(): Promise<void> {
    if (this.productForm.valid && this.cardImageBase64 !== null) {
      if (this.selectedItems.length > 0) {
        const categories = [];
        this.selectedItems.forEach(element => {
          categories.push(element.id);
        });
        const url = 'product/add';
        const payload = {
          name: this.productForm.value.productname,
          price: this.productForm.value.productprice,
          volume: this.productForm.value.productvolume,
          image: this.cardImageBase64,
          description: this.productForm.value.productdesc,
          category: categories
        };
        this.showloader = true;
        this.apiService.sendHttpCallWithToken(payload, url, 'post').subscribe((response) => {
          console.log('submitProduct response: ' , response);
          this.showloader = false;
          if (response.status === 200) {
            this.dataService.showSuccess(response.message);
          } else if (response.status === 400) {
            this.dataService.showError(response.message);
          } else {
            this.dataService.showError('Unable to add product');
          }
        }, (error) => {
          console.log('submitCategory error: ' , error);
          this.showloader = false;
          if (error.message) {
            this.dataService.showError(error.message);
          } else {
            this.dataService.showError('Unable to add product');
          }
        });
      } else {
        this.dataService.showError('Please select a category'); // --- Display error message
      }
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.productForm.controls).forEach((field) => {
        const control = this.productForm.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }
  resetForm(element): void {
    this.productForm.patchValue({
      productname: '',
      productdesc: '',
      productprice: '',
      productvolume: '',
    });

    this.cardImageBase64 = null;
    this.isImageSaved = false;
    element.value = '';
  }

}
