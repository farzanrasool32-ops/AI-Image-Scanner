import { Search } from "lucide-react";

export default function ProductAnalysis({ products }: { products: string[] }) {
  return (
    <article className="result-card">
      <div className="result-card-heading">
        <span>
          <Search size={17} />
        </span>
        <h3>Products</h3>
      </div>
      <div className="tag-list">
        {products.length ? (
          products.map((item, index) => (
            <span className="result-tag product-tag" key={`${item}-${index}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="muted-copy">No products identified.</span>
        )}
      </div>
    </article>
  );
}
