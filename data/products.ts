/* ---------- Types ---------- */
export type Product = {
  id: string;
  name: string;
  badge?: string;
  rating: number;
  size: string;
  price: number;
  oldPrice?: number;
  image?: string; // product photo, jaise "/images/products/ghee.png" (optional)
  emoji: string; // image na ho ya load na ho to ye dikhega
  color: string; // card ka background
};

export type Category = {
  name: string;
  href: string; // click par kahan jaye
  image?: string; // icon image: public/images/ me rakho
  emoji: string; // image na mile to ye dikhega
};

export type Testimonial = {
  title: string;
  text: string;
  name: string;
  product: string;
};

/* ---------- Products ---------- */
export const bestSellers: Product[] = [
  { id: "ghee", name: "A2 Ghee - Hand Churned Gir Cow Bilona Ghee", badge: "🔥 Best Seller", rating: 4.9, size: "250 ML", price: 699, emoji: "🫙", color: "bg-amber-100" },
  { id: "amla", name: "Amlaprash (Chyawanprash)", badge: "⚡ Selling Fast", rating: 4.9, size: "500g", price: 659, emoji: "🍯", color: "bg-orange-100" },
  { id: "honey", name: "Wild Forest Honey", badge: "🚀 Trending", rating: 4.7, size: "500g", price: 589, emoji: "🐝", color: "bg-yellow-100" },
  { id: "mustard", name: "Stone Pressed Black Mustard Oil", badge: "🚀 Trending", rating: 4.9, size: "1000 ML", price: 390, emoji: "🌿", color: "bg-lime-100" },
  { id: "khapli", name: "Khapli (Emmer) Wheat Atta", badge: "😋 Must Try", rating: 4.7, size: "2 kg", price: 499, emoji: "🌾", color: "bg-stone-200" },
  { id: "mango", name: "Mango Pickle - Natural Sun Dried", badge: "☀️ Summer Special", rating: 4.8, size: "300 Gms", price: 349, emoji: "🥭", color: "bg-red-100" },
  { id: "groundnut", name: "Stone Pressed Groundnut Oil", badge: "🚀 Trending", rating: 4.9, size: "1000 ML", price: 445, emoji: "🥜", color: "bg-amber-50" },
];

export const categories: Category[] = [
  { name: "Pure Cow Ghee", href: "/collections/ghee", image: "/images/icon1.png", emoji: "🫙" },
  { name: "Cold Press Mustard Oil", href: "/collections/stone-press-oil", image: "/images/oil.png", emoji: "🌿" },
  { name: "Pure Milk", href: "/collections/atta", image: "/images/milk.jpeg", emoji: "🌾" },
  { name: "Pure Paneer", href: "/collections/healthy-snacking", image: "/images/icon5.png", emoji: "🥣" },
];

/* ---------- Testimonials ---------- */
export const testimonials: Testimonial[] = [
  { title: "Old-school fuel. Real results.", text: "Balancing endurance sports, a demanding IT career and family life has taught me that food needs to do more than fill the plate. A2 Bilona Ghee gives me steady, long-lasting energy.", name: "Sumit S.", product: "A2 Bilona Ghee" },
  { title: "Healthy Choice for Everyday Meals!", text: "Switching to Khapli Wheat Atta was the best choice for our health. It's fresh, nutritious, and perfect for our daily meals!", name: "Alisha A.", product: "Khapli Wheat Atta" },
  { title: "Taste That Feels Like Home", text: "A2 Desi Cow Ghee makes my meals comforting and flavorful. The quality and purity are simply outstanding.", name: "Himanshi S.", product: "A2 Bilona Ghee" },
  { title: "Rich Tradition in Every Drop", text: "This ghee brings the richness of tradition to my kitchen. Its pure taste elevates every dish beautifully.", name: "Sushmita", product: "A2 Bilona Ghee" },
  { title: "Pure Aroma, Authentic Taste!", text: "Gives my cooking a rich, authentic flavor. The purity and aroma are unmatched, my family loves it!", name: "Ankush S.", product: "A2 Bilona Ghee" },
];