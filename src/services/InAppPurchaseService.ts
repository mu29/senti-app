import InAppPurchase, { Product } from 'react-native-in-app-purchase';

type FetchProductObserver = (productIds: string[]) => void;

class InAppPurchaseService {
  private configured = false;

  private productIds: string[] = [];

  private observers: FetchProductObserver[] = [];

  public async configure(productIds: string[]) {
    if (this.configured || productIds.length === 0) {
      return;
    }

    InAppPurchase.onFetchProducts(this.onFetchProducts);

    return InAppPurchase.configure().then(() => {
      this.configured = true;
      InAppPurchase.fetchProducts(productIds);
    }).catch(console.error);
  }

  public addObserver(observer: FetchProductObserver) {
    this.observers.push(observer);
    if (this.productIds.length > 0) {
      observer(this.productIds);
    }
  }

  public removeObserver(observer: FetchProductObserver) {
    this.observers = this.observers.filter(o => o === observer);
  }

  private onFetchProducts(products: Product[]) {
    this.productIds = products.map(p => p.productId);
  }
}

export default new InAppPurchaseService();
