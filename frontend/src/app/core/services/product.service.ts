@Injectable({ providedIn: 'root' })
export class ProductService {
  api = 'http://localhost:8080/api/products';
  constructor(private http: HttpClient) {}
  getAll(){ return this.http.get<any[]>(this.api); }
}
