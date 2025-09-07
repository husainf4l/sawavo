import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { signal, computed, effect } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductQueryParams } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="product-list-container apple-fade-in">
      <!-- Header Section -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title apple-title">Products</h1>
          <p class="page-subtitle apple-body">Manage your skincare product catalog</p>
        </div>
        <div class="header-actions">
          <button 
            *ngIf="!isSelectionMode()"
            class="apple-button apple-button-secondary"
            (click)="toggleSelectionMode()"
            matTooltip="Select multiple products">
            <mat-icon>checklist</mat-icon>
            Select
          </button>
          <button 
            class="add-button apple-button apple-button-primary"
            (click)="navigateToAddProduct()">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <div class="bulk-actions-bar apple-card" *ngIf="isSelectionMode()">
        <div class="bulk-selection-info">
          <mat-checkbox
            [checked]="isAllSelected()"
            [indeterminate]="isIndeterminate()"
            (change)="toggleSelectAll()">
          </mat-checkbox>
          <span class="selection-text apple-body">
            {{ selectedCount() > 0 ? selectedCount() + ' selected' : 'Select all' }}
          </span>
        </div>
        <div class="bulk-actions">
          <button 
            class="apple-button apple-button-danger"
            [disabled]="selectedCount() === 0 || isDeleting()"
            (click)="deleteSelectedProducts()">
            <mat-spinner diameter="16" *ngIf="isDeleting()"></mat-spinner>
            <mat-icon *ngIf="!isDeleting()">delete</mat-icon>
            Delete Selected ({{ selectedCount() }})
          </button>
          <button 
            class="apple-button apple-button-secondary"
            (click)="toggleSelectionMode()">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
        </div>
      </div>

      <!-- Danger Zone - Delete All Products -->
      <div class="danger-zone apple-card" *ngIf="!isSelectionMode() && totalProducts() > 0">
        <div class="danger-zone-content">
          <div class="danger-info">
            <mat-icon class="danger-icon">warning</mat-icon>
            <div class="danger-text">
              <h3 class="danger-title">Danger Zone</h3>
              <p class="danger-description">Permanently delete all {{ totalProducts() }} products from the database. This action cannot be undone.</p>
            </div>
          </div>
          <button 
            class="apple-button apple-button-danger danger-button"
            [disabled]="isDeleting()"
            (click)="deleteAllProducts()">
            <mat-spinner diameter="16" *ngIf="isDeleting()"></mat-spinner>
            <mat-icon *ngIf="!isDeleting()">delete_forever</mat-icon>
            Delete All Products
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="search-filter-section apple-card">
        <div class="search-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search products</mat-label>
            <input 
              matInput 
              placeholder="Search by name, SKU, or description..."
              [ngModel]="searchQuery()"
              (ngModelChange)="updateSearchQuery($event)"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        
        <div class="filter-chips">
          <mat-chip-set>
            <mat-chip 
              [class.selected]="selectedFilter() === 'all'"
              (click)="setFilter('all')">
              All Products
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'all'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'featured'"
              (click)="setFilter('featured')">
              Featured
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'featured'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'today-deal'"
              (click)="setFilter('today-deal')">
              Today's Deal
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'today-deal'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'low-stock'"
              (click)="setFilter('low-stock')">
              Low Stock
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'low-stock'">check</mat-icon>
            </mat-chip>
            <mat-chip 
              [class.selected]="selectedFilter() === 'new'"
              (click)="setFilter('new')">
              New Products
              <mat-icon matChipTrailingIcon *ngIf="selectedFilter() === 'new'">check</mat-icon>
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Products List -->
      <div class="products-section" *ngIf="!loading() && paginatedProducts().length > 0">
        <div class="apple-list apple-slide-up">
          <div 
            *ngFor="let product of paginatedProducts(); trackBy: trackByProductId" 
            class="product-item apple-list-item"
            [class.selected]="isSelectionMode() && selectedProducts().has(product.id)">
            
            <!-- Selection Checkbox -->
            <div class="product-selection" *ngIf="isSelectionMode()">
              <mat-checkbox
                [checked]="selectedProducts().has(product.id)"
                (change)="toggleProductSelection(product.id)">
              </mat-checkbox>
            </div>
            
            <div class="product-content" [class.with-selection]="isSelectionMode()">
              <div class="product-main">
                  <div class="product-image-container">
                    <img 
                      [src]="getMainImage(product) || '/assets/images/no-image.svg'" 
                      [alt]="product?.title || 'Product image'"
                      class="product-image"
                      (error)="onImageError($event)"
                    />
                  </div>                <div class="product-info">
                  <div class="product-header">
                    <h3 class="product-title apple-headline">{{ product?.title || 'Untitled Product' }}</h3>
                    <div class="product-badges">
                      <span class="apple-badge apple-badge-primary" *ngIf="product?.isFeatured">
                        <mat-icon>star</mat-icon>
                        Featured
                      </span>
                      <span class="apple-badge apple-badge-warning" *ngIf="product?.isTodayDeal">
                        <mat-icon>local_offer</mat-icon>
                        Today's Deal
                      </span>
                      <span class="apple-badge apple-badge-success" *ngIf="product?.isNew">
                        <mat-icon>fiber_new</mat-icon>
                        New
                      </span>
                      <span 
                        class="apple-badge"
                        [class.apple-badge-success]="(product?.stockQuantity || 0) > 10"
                        [class.apple-badge-warning]="(product?.stockQuantity || 0) <= 10 && (product?.stockQuantity || 0) > 0"
                        [class.apple-badge-danger]="(product?.stockQuantity || 0) === 0">
                        {{ (product?.stockQuantity || 0) === 0 ? 'Out of Stock' : (product?.stockQuantity || 0) + ' in stock' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="product-meta">
                    <p class="product-description apple-body">
                      {{ (product.descriptionEn || '') | slice:0:120 }}<span *ngIf="(product.descriptionEn || '').length > 120">...</span>
                    </p>
                    
                    <div class="product-details">
                      <div class="detail-item">
                        <mat-icon class="detail-icon">local_offer</mat-icon>
                        <span class="apple-caption">SKU: {{ product?.sku || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <mat-icon class="detail-icon">category</mat-icon>
                        <span class="apple-caption">{{ product?.category || product?.categoryId || 'Uncategorized' }}</span>
                      </div>
                      <div class="detail-item" *ngIf="product?.skinType">
                        <mat-icon class="detail-icon">face</mat-icon>
                        <span class="apple-caption">{{ product?.skinType }}</span>
                      </div>
                      <div class="detail-item" *ngIf="product?.activeIngredients">
                        <mat-icon class="detail-icon">science</mat-icon>
                        <span class="apple-caption">{{ product?.activeIngredients | slice:0:30 }}{{ (product?.activeIngredients || '').length > 30 ? '...' : '' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="product-actions">
                <div class="price-section">
                  <div class="current-price apple-headline">
                    \${{ product?.price | number:'1.2-2' }}
                  </div>
                  <div class="compare-price apple-caption" *ngIf="product?.compareAtPrice && (product?.compareAtPrice || 0) > (product?.price || 0)">
                    <span class="strikethrough">\${{ product?.compareAtPrice | number:'1.2-2' }}</span>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button 
                    class="apple-button apple-button-secondary"
                    [disabled]="editingProductId() === product.id"
                    (click)="editProduct(product)"
                    matTooltip="Edit product">
                    <mat-spinner diameter="16" *ngIf="editingProductId() === product.id"></mat-spinner>
                    <mat-icon *ngIf="editingProductId() !== product.id">edit</mat-icon>
                    {{ editingProductId() === product.id ? 'Loading...' : 'Edit' }}
                  </button>
                  <button 
                    class="apple-button apple-button-secondary"
                    (click)="viewProduct(product)"
                    matTooltip="View details">
                    <mat-icon>visibility</mat-icon>
                    View
                  </button>
                  <button 
                    *ngIf="!isSelectionMode()"
                    class="apple-button apple-button-danger"
                    (click)="deleteProduct(product)"
                    matTooltip="Delete product">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state apple-card" *ngIf="!loading() && paginatedProducts().length === 0">
        <div class="empty-content">
          <mat-icon class="empty-icon">inventory_2</mat-icon>
          <h2 class="apple-headline">No products found</h2>
          <p class="apple-body" *ngIf="searchQuery()">
            Try adjusting your search criteria or filters
          </p>
          <p class="apple-body" *ngIf="!searchQuery()">
            Get started by adding your first skincare product
          </p>
          <button 
            class="apple-button apple-button-primary"
            (click)="navigateToAddProduct()"
            *ngIf="!searchQuery()">
            <mat-icon>add</mat-icon>
            Add Your First Product
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state apple-card" *ngIf="loading()">
        <div class="loading-content">
          <mat-spinner diameter="40"></mat-spinner>
          <p class="apple-body">Loading products...</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-section apple-card" *ngIf="totalProducts() > pageSize()">
        <mat-paginator
          [length]="totalProducts()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 25, 50, 100]"
          [pageIndex]="currentPage()"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-lg);
      min-height: calc(100vh - 120px);
    }

    /* Header Section */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--apple-spacing-lg);
    }

    .title-section {
      flex: 1;
    }

    .page-title {
      margin-bottom: var(--apple-spacing-xs);
    }

    .page-subtitle {
      margin: 0;
      color: var(--apple-text-secondary);
    }

    .add-button {
      min-width: 140px;
      height: 44px;
      white-space: nowrap;
    }

    /* Search and Filter Section */
    .search-filter-section {
      padding: var(--apple-spacing-lg);
    }

    .search-container {
      margin-bottom: var(--apple-spacing-md);
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .filter-chips mat-chip-set {
      display: flex;
      gap: var(--apple-spacing-sm);
      flex-wrap: wrap;
    }

    .filter-chips mat-chip {
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--apple-gray-6);
      color: var(--apple-text-secondary);
    }

    .filter-chips mat-chip.selected {
      background: var(--apple-blue) !important;
      color: white !important;
    }

    .filter-chips mat-chip:hover:not(.selected) {
      background: var(--apple-gray-5);
    }

    /* Products List */
    .products-section {
      flex: 1;
    }

    .product-item {
      padding: var(--apple-spacing-lg);
    }

    .product-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--apple-spacing-lg);
      width: 100%;
    }

    .product-main {
      display: flex;
      gap: var(--apple-spacing-md);
      flex: 1;
      min-width: 0;
    }

    .product-image-container {
      width: 80px;
      height: 80px;
      border-radius: var(--apple-radius-md);
      overflow: hidden;
      flex-shrink: 0;
      background: var(--apple-gray-6);
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s ease;
    }

    .product-info {
      flex: 1;
      min-width: 0;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--apple-spacing-md);
      margin-bottom: var(--apple-spacing-sm);
    }

    .product-title {
      margin: 0;
      color: var(--apple-text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
    }

    .product-badges {
      display: flex;
      gap: var(--apple-spacing-xs);
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .product-meta {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-sm);
    }

    .product-description {
      margin: 0;
      line-height: 1.4;
    }

    .product-details {
      display: flex;
      gap: var(--apple-spacing-md);
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--apple-spacing-xs);
    }

    .detail-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--apple-text-tertiary);
    }

    /* Product Actions */
    .product-actions {
      display: flex;
      flex-direction: column;
      gap: var(--apple-spacing-md);
      align-items: flex-end;
      flex-shrink: 0;
    }

    .price-section {
      text-align: right;
    }

    .current-price {
      margin: 0;
      color: var(--apple-green);
      font-weight: 700;
    }

    .compare-price {
      margin: 0;
      color: var(--apple-text-tertiary);
    }

    .strikethrough {
      text-decoration: line-through;
    }

    .action-buttons {
      display: flex;
      gap: var(--apple-spacing-sm);
    }

    .action-buttons .apple-button {
      min-width: auto;
      padding: 8px 12px;
      font-size: 14px;
    }

    .action-buttons .apple-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .action-buttons .apple-button mat-spinner {
      margin-right: 4px;
    }

    /* Empty State */
    .empty-state, .loading-state {
      padding: var(--apple-spacing-2xl);
      text-align: center;
    }

    .empty-content, .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--apple-spacing-md);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--apple-gray-3);
      margin-bottom: var(--apple-spacing-sm);
    }

    .loading-content mat-spinner {
      margin-bottom: var(--apple-spacing-md);
    }

    /* Pagination */
    .pagination-section {
      padding: var(--apple-spacing-md) var(--apple-spacing-lg);
      display: flex;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: var(--apple-spacing-md);
      }

      .add-button {
        width: 100%;
      }

      .product-content {
        flex-direction: column;
        align-items: stretch;
        gap: var(--apple-spacing-md);
      }

      .product-main {
        width: 100%;
      }

      .product-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--apple-spacing-sm);
      }

      .product-badges {
        justify-content: flex-start;
      }

      .product-actions {
        align-items: stretch;
      }

      .price-section {
        text-align: left;
      }

      .action-buttons {
        width: 100%;
        justify-content: space-between;
      }

      .action-buttons .apple-button {
        flex: 1;
      }

      .product-details {
        flex-direction: column;
        gap: var(--apple-spacing-xs);
      }
    }

    @media (max-width: 480px) {
      .product-image-container {
        width: 60px;
        height: 60px;
      }

      .filter-chips mat-chip-set {
        justify-content: center;
      }
    }

    /* Bulk Selection Styles */
    .header-actions {
      display: flex;
      gap: var(--apple-spacing-md);
      align-items: center;
    }

    .bulk-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--apple-spacing-md);
      margin-bottom: var(--apple-spacing-lg);
      background: var(--apple-background-secondary);
      border: 1px solid var(--apple-border);
    }

    .bulk-selection-info {
      display: flex;
      align-items: center;
      gap: var(--apple-spacing-sm);
    }

    .selection-text {
      font-weight: 500;
      color: var(--apple-text-primary);
    }

    .bulk-actions {
      display: flex;
      gap: var(--apple-spacing-sm);
    }

    .product-item.selected {
      background: var(--apple-background-tertiary);
      border-color: var(--apple-color-primary);
    }

    .product-selection {
      padding: var(--apple-spacing-md);
      border-right: 1px solid var(--apple-border);
    }

    .product-content.with-selection {
      flex: 1;
    }

    .product-item {
      display: flex;
      align-items: center;
    }

    /* Danger Zone Styles */
    .danger-zone {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 2px solid #fca5a5;
      border-radius: 12px;
      margin-bottom: var(--apple-spacing-lg);
    }

    .danger-zone-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--apple-spacing-lg);
    }

    .danger-info {
      display: flex;
      align-items: center;
      gap: var(--apple-spacing-md);
    }

    .danger-icon {
      color: #dc2626;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .danger-text {
      flex: 1;
    }

    .danger-title {
      margin: 0 0 var(--apple-spacing-xs) 0;
      color: #dc2626;
      font-size: 18px;
      font-weight: 600;
    }

    .danger-description {
      margin: 0;
      color: #7f1d1d;
      font-size: 14px;
      line-height: 1.4;
    }

    .danger-button {
      background: #dc2626 !important;
      border-color: #dc2626 !important;
      font-weight: 600;
    }

    .danger-button:hover:not(:disabled) {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }

    @media (max-width: 768px) {
      .danger-zone-content {
        flex-direction: column;
        gap: var(--apple-spacing-md);
        text-align: center;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  // Injected services
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Search debouncing
  private searchSubject = new Subject<string>();

  // Signals for reactive state management
  private readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly searchQuery = signal('');
  readonly selectedFilter = signal<'all' | 'featured' | 'today-deal' | 'low-stock' | 'new'>('all');
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly editingProductId = signal<string | null>(null);
  readonly totalProducts = signal(0);
  
  // Bulk selection
  readonly selectedProducts = signal<Set<string>>(new Set());
  readonly isSelectionMode = signal(false);
  readonly isDeleting = signal(false);

  // Computed properties
  readonly isAllSelected = computed(() => {
    const selected = this.selectedProducts();
    const products = this.allProducts();
    return products.length > 0 && selected.size === products.length;
  });

  readonly isIndeterminate = computed(() => {
    const selected = this.selectedProducts();
    const products = this.allProducts();
    return selected.size > 0 && selected.size < products.length;
  });

  readonly selectedCount = computed(() => this.selectedProducts().size);

  // Use server-side pagination instead of client-side filtering
  readonly paginatedProducts = computed(() => this.allProducts());

  ngOnInit(): void {
    this.loadProducts();
    
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.currentPage.set(0);
      this.loadProducts();
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    
    const params: ProductQueryParams = {
      page: this.currentPage() + 1, // API uses 1-based pagination
      limit: this.pageSize(),
    };

    // Add search query if present
    const query = this.searchQuery().trim();
    if (query) {
      params.search = query;
    }

    // Add filters based on the backend API
    const filter = this.selectedFilter();
    switch (filter) {
      case 'featured':
        params.isFeatured = true;
        break;
      case 'today-deal':
        params.isTodayDeal = true;
        break;
      case 'low-stock':
        // For low stock, we'll fetch all and filter client-side since backend doesn't have this filter
        // Or we could fetch all products and filter them
        break;
      case 'new':
        params.isNew = true;
        break;
    }

    // Always get active products by default
    params.isActive = true;

    this.productService.getProducts(params).subscribe({
      next: (result) => {
        let products = Array.isArray(result.products) ? result.products : [];
        
        // Apply client-side low-stock filter if needed
        if (filter === 'low-stock') {
          products = products.filter(product => (product.stockQuantity || 0) <= 10);
        }
        
        this.allProducts.set(products);
        if (result.pagination) {
          this.totalProducts.set(result.pagination.total);
        } else {
          this.totalProducts.set(products.length);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.allProducts.set([]);
        this.totalProducts.set(0);
        this.loading.set(false);
      }
    });
  }

  updateSearchQuery(query: string): void {
    // Use debounced search instead of immediate API call
    this.searchSubject.next(query);
  }

  setFilter(filter: 'all' | 'featured' | 'today-deal' | 'low-stock' | 'new'): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(0); // Reset to first page
    this.loadProducts(); // Reload with new filter
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts(); // Reload with new pagination
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(product: Product): void {
    // Set loading state for this specific product
    this.editingProductId.set(product.id);
    
    // First get the latest product data from the backend
    this.productService.getProductById(product.id).subscribe({
      next: (productData) => {
        // Navigate to edit route with the updated product data
        this.router.navigate(['/products/edit', product.id], {
          state: { productData }
        });
        this.editingProductId.set(null);
      },
      error: (error) => {
        console.error('Error fetching product for edit:', error);
        alert('Failed to load product data for editing. Please try again.');
        this.editingProductId.set(null);
      }
    });
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  toggleSelectionMode(): void {
    this.isSelectionMode.set(!this.isSelectionMode());
    if (!this.isSelectionMode()) {
      this.selectedProducts.set(new Set());
    }
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedProducts.set(new Set());
    } else {
      const allIds = this.allProducts().map(p => p.id);
      this.selectedProducts.set(new Set(allIds));
    }
  }

  toggleProductSelection(productId: string): void {
    const selected = new Set(this.selectedProducts());
    if (selected.has(productId)) {
      selected.delete(productId);
    } else {
      selected.add(productId);
    }
    this.selectedProducts.set(selected);
  }

  deleteSelectedProducts(): void {
    const selectedIds = Array.from(this.selectedProducts());
    if (selectedIds.length === 0) return;

    const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} selected product(s)?`);
    if (!confirmed) return;

    this.isDeleting.set(true);
    this.productService.deleteProducts(selectedIds).subscribe({
      next: () => {
        this.snackBar.open(`${selectedIds.length} product(s) deleted successfully`, 'Close', { duration: 3000 });
        this.selectedProducts.set(new Set());
        this.isSelectionMode.set(false);
        this.isDeleting.set(false);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting products:', error);
        this.snackBar.open('Failed to delete products. Please try again.', 'Close', { duration: 5000 });
        this.isDeleting.set(false);
      }
    });
  }

  deleteAllProducts(): void {
    const totalCount = this.totalProducts();
    const confirmed = confirm(
      `⚠️ DANGER: This will permanently delete ALL ${totalCount} products from the database!\n\n` +
      `This action cannot be undone and will also delete all associated images.\n\n` +
      `Type "DELETE ALL PRODUCTS" to confirm:`
    );
    
    if (!confirmed) return;

    // Additional confirmation with text input
    const confirmText = prompt(
      `Please type "DELETE ALL PRODUCTS" (without quotes) to confirm this destructive action:`
    );
    
    if (confirmText !== 'DELETE ALL PRODUCTS') {
      this.snackBar.open('Deletion cancelled. Text did not match.', 'Close', { duration: 3000 });
      return;
    }

    this.isDeleting.set(true);
    this.productService.deleteAllProducts().subscribe({
      next: (response) => {
        const deletedCount = response.data?.deletedProductsCount || totalCount;
        const deletedImages = response.data?.deletedImagesCount || 0;
        this.snackBar.open(
          `All ${deletedCount} products and ${deletedImages} images deleted successfully`, 
          'Close', 
          { duration: 5000 }
        );
        this.isDeleting.set(false);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting all products:', error);
        this.snackBar.open('Failed to delete all products. Please try again.', 'Close', { duration: 5000 });
        this.isDeleting.set(false);
      }
    });
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
        // Reload products after deletion
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.snackBar.open('Failed to delete product. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  getMainImage(product: Product): string | null {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const mainImage = product.images.find(img => img?.isMain);
      return mainImage?.url || product.images[0]?.url || null;
    }
    return null;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/no-image.svg';
  }
}
