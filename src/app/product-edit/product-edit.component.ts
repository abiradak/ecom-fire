import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  productData: any;
  productId: string = null;
  productForm: FormGroup;
  nameValidationRegex: any;
  priceValidationRegex: any;
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
  categoryList =  [];
  selectedCategories = [];
  selectedCategoriesOld = [];
  brandsList =  [];
  selectedBrands = [];
  selectedBrandsOld = [];
  dropdownSettings: IDropdownSettings;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.priceValidationRegex = this.dataService.priceValidationRegex;
    this.maxFileSize = this.dataService.maxFileSize;

    this.productForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      productname: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)]),
      productdesc: new FormControl('', [Validators.required, Validators.minLength(2)]),
      productprice: new FormControl('', [Validators.required, Validators.pattern(this.priceValidationRegex)]),
      productvolume: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      brands: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    // console.log('ngOnInit this.productId: ', this.productId);
    if (this.productId.length === 0) {
      this.dataService.showError('Product details not found.'); // --- Display error message
      this.router.navigate(['/product-list']);
    } else {
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
  }

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
      this.getBrandsFromApi();
      // console.log('this.productList: ', this.productList);
    }, (error) => {
      console.log('getProductFromApi error: ' , error);
      this.getBrandsFromApi();
      this.showloader = false;
      this.dataService.showError('Unable to load category list!');
    });
  }

  async getBrandsFromApi(): Promise<void> {
    const url = 'brands';
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      console.log('getBrandsFromApi response: ' , response);
      this.showloader = false;
      this.brandsList = [];
      if (response.brand && response.brand.length > 0) {
        response.brand.forEach(element => {
          this.brandsList.push({
            id: element.id,
            name: element.data.name
          });
        });
      } else {
        this.dataService.showError('No brand found!');
      }
      this.getProduct();
      // console.log('this.brandsList: ', this.brandsList);
    }, (error) => {
      console.log('getBrandsFromApi error: ' , error);
      this.getProduct();
      this.showloader = false;
      this.dataService.showError('Unable to load brand list!');
    });
  }

  onItemSelect(item: any): void  {
    // console.log('onItemSelect: ', item);
    this.selectedCategories.push(item);
    // console.log('onItemSelect this.selectedCategories: ', this.selectedCategories);
  }

  onItemDeSelect(item: any): void  {
    // console.log('onItemDeSelect: ', item);
    this.selectedCategories = this.selectedCategories.filter(data => data.id !== item.id);
    // console.log('onItemDeSelect this.selectedCategories: ', this.selectedCategories);
  }

  onSelectAll(items: any): void  {
    // console.log('onSelectAll: ', items);
    this.selectedCategories = items;
    // console.log('onSelectAll this.selectedCategories: ', this.selectedCategories);
  }

  onDeSelectAll(items: any): void  {
    // console.log('onDeSelectAll: ', items);
    this.selectedCategories = [];
    // console.log('onDeSelectAll this.selectedCategories: ', this.selectedCategories);
  }

  onItemSelect1(item: any): void  {
    // console.log('onItemSelect: ', item);
    this.selectedBrands.push(item);
    // console.log('onItemSelect this.selectedBrands: ', this.selectedBrands);
  }

  onItemDeSelect1(item: any): void  {
    // console.log('onItemDeSelect: ', item);
    this.selectedBrands = this.selectedBrands.filter(data => data.id !== item.id);
    // console.log('onItemDeSelect this.selectedBrands: ', this.selectedBrands);
  }

  onSelectAll1(items: any): void  {
    // console.log('onSelectAll: ', items);
    this.selectedBrands = items;
    // console.log('onSelectAll this.selectedBrands: ', this.selectedBrands);
  }

  onDeSelectAll1(items: any): void  {
    // console.log('onDeSelectAll: ', items);
    this.selectedBrands = [];
    // console.log('onDeSelectAll this.selectedBrands: ', this.selectedBrands);
  }

  async getProduct(): Promise<void> {
    const url = 'product/' + this.productId;
    this.showloader = true;
    this.apiService.sendHttpCallWithToken('', url, 'get').subscribe((response) => {
      // console.log('getProduct response: ' , response);
      this.showloader = false;
      if (response.product) {
        this.productData = response.product;
        this.populateProductData();
      } else {
        if (response.message) {
          this.dataService.showError(response.message);
        } else {
          this.dataService.showError('No product found!');
        }
        // this.router.navigate(['/product-list']);
      }
      // console.log('this.productData: ', this.productData);
    }, (error) => {
      console.log('getProduct error: ' , error);
      this.showloader = false;
      if (error.message) {
        this.dataService.showError(error.message);
      } else {
        this.dataService.showError('Unable to load product list!');
      }
      this.router.navigate(['/product-list']);
    });
  }

  populateProductData(): void {
    if (this.productData.data.image !== null || this.productData.data.image !== '') {
      this.cardImageBase64 = this.productData.data.image;
      this.isImageSaved = true;
    }
    this.productForm.patchValue({
      productname: this.productData.data.name,
      productprice: this.productData.data.price,
      productvolume: this.productData.data.volume,
      productdesc: this.productData.data.description,
    });
    this.selectedCategories = [];
    if (this.productData.category.length > 0) {
      this.productData.category.forEach(element => {
        this.selectedCategories.push({
          id: element.id,
          name: element.name
        });
      });
      this.selectedCategoriesOld = this.selectedCategories;
      this.productForm.patchValue({
        category: this.selectedCategories,
      });
    }
    this.selectedBrands = [];
    if (this.productData.brand.length > 0) {
      this.productData.brand.forEach(element => {
        this.selectedBrands.push({
          id: element.id,
          name: element.name
        });
      });
      this.selectedBrandsOld = this.selectedBrands;
      this.productForm.patchValue({
        brands: this.selectedBrands,
      });
    }
  }

  fileChangeEvent(fileInput: any): boolean {
    this.imageError = null;
    this.cardImageBase64 = this.productData.data.image;
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
    if (this.productData.data.image !== null || this.productData.data.image !== '') {
      this.cardImageBase64 = this.productData.data.image;
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
      this.editorError = 'Product description is required.';
    }
  }

  async submitProduct(element): Promise<void> {
    if (this.productForm.valid && this.cardImageBase64 !== null) {
      if (this.selectedCategories.length > 0) {
        const categories = [];
        this.selectedCategories.forEach(element1 => {
          categories.push(element1.id);
        });
        const brands = [];
        if (this.selectedBrands.length > 0) {
          this.selectedBrands.forEach(element1 => {
            brands.push(element1.id);
          });
        }
        const url = 'product/edit/' + this.productId;
        const payload = {
          name: this.productForm.value.productname,
          price: this.productForm.value.productprice,
          volume: this.productForm.value.productvolume,
          image: this.cardImageBase64,
          description: this.productForm.value.productdesc,
          category: categories,
          brand: brands
        };
        if (this.cardImageBase64 === null) {
          delete payload.image;
        }
        this.showloader = true;
        // console.log('submitProduct payload: ', payload);
        this.apiService.sendHttpCallWithToken(payload, url, 'patch').subscribe((response) => {
          // console.log('submitProduct response: ' , response);
          this.showloader = false;
          if (response.status === 200) {
            this.dataService.showSuccess(response.message);
            this.productData.data.image = this.cardImageBase64;
            this.productData.data.name = this.productForm.value.productname;
            this.productData.data.description = this.productForm.value.productdesc;
            this.productData.data.price = this.productForm.value.productprice;
            this.productData.data.volume = this.productForm.value.productvolume;
            this.selectedCategoriesOld = this.selectedCategories;
            this.selectedBrandsOld = this.selectedBrands;
            this.isImageChanged = false;
            element.value = '';
          } else if (response.status === 400) {
            this.dataService.showError(response.message);
          } else {
            this.dataService.showError('Unable to edit product');
          }
        }, (error) => {
          console.log('submitProduct error: ' , error);
          this.showloader = false;
          if (error.message) {
            this.dataService.showError(error.message);
          } else {
            this.dataService.showError('Unable to edit product');
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
    this.selectedCategories = this.selectedCategoriesOld;
    this.selectedBrands = this.selectedBrandsOld;
    this.productForm.patchValue({
      productname: this.productData.data.name,
      productprice: this.productData.data.price,
      productvolume: this.productData.data.volume,
      productdesc: this.productData.data.description,
      category: this.selectedCategories,
      brands: this.selectedBrands,
    });

    if (this.isImageChanged) {
      this.cardImageBase64 = this.productData.data.image;
      this.isImageChanged = false;
      element.value = '';
    }
  }

}
