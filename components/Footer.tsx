const cols = [
  { title: "HELPFUL LINKS", links: ["Our Story", "All Products", "Recipes", "Blog", "Lab Reports", "Career"] },
  { title: "POLICIES", links: ["Refund Policy", "Shipping Policy", "Privacy Policy", "Terms of Service"] },
];

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-extrabold">YourBrand.</h3>
          <p className="mt-3 text-sm text-green-200">
            Bringing the wisdom and flavors of Old Bharat to today&apos;s tables.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-sm font-bold tracking-widest">{c.title}</h4>
            <ul className="space-y-2 text-sm text-green-200">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-sm font-bold tracking-widest">SUBSCRIBE TO OUR NEWSLETTER</h4>
          <div className="flex">
            <input type="email" placeholder="Your email" className="w-full rounded-l-full px-4 py-2 text-sm text-black outline-none" />
            <button className="rounded-r-full bg-amber-500 px-4 text-sm font-bold text-black">Join</button>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <a href="#">Facebook</a><a href="#">Instagram</a><a href="#">YouTube</a>
          </div>
        </div>
      </div>
      <div className="border-t border-green-800 py-4 text-center text-xs text-green-300">
        © 2026 YourBrand. All Rights Reserved.
      </div>
    </footer>
  );
}
