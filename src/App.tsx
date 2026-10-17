import { useEffect, useLayoutEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Heart, Leaf, Minus, Plus, Search, ShoppingBag, Sparkles, Tag, X } from 'lucide-react'
import './App.css'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const formatPrice = (amount: number) => inr.format(amount)

type Product = {
  id: number
  name: string
  detail: string
  price: number
  unit: string
  category: string
  image: string
  color: string
  badge?: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Ragi jaggery biscuits',
    detail: 'Crisp millet biscuits, jaggery-sweet',
    price: 199,
    unit: '180 g pack',
    category: 'Biscuits',
    image: 'photo-1558961363-fa8fdf82db35',
    color: 'orange',
    badge: 'Homemade',
  },
  {
    id: 2,
    name: 'Dark chocolate millet bites',
    detail: 'A little cocoa, plenty of crunch',
    price: 249,
    unit: '150 g pack',
    category: 'Chocolates',
    image: 'photo-1511381939415-e44015466834',
    color: 'pink',
    badge: 'Small batch',
  },
  {
    id: 3,
    name: 'Almond ragi cookies',
    detail: 'Toasty almonds in every bite',
    price: 229,
    unit: '6 cookies',
    category: 'Biscuits',
    image: 'photo-1499636136210-6f4ee915583e',
    color: 'yellow',
  },
  {
    id: 4,
    name: 'Jaggery choco crunch',
    detail: 'Dark chocolate with millet crisps',
    price: 299,
    unit: '120 g bar',
    category: 'Chocolates',
    image: 'photo-1511381939415-e44015466834',
    color: 'blue',
    badge: 'Jaggery-sweet',
  },
  {
    id: 5,
    name: 'Little millet sesame crisps',
    detail: 'Lightly toasted, delicately sweet',
    price: 159,
    unit: '160 g pack',
    category: 'Millet snacks',
    image: 'photo-1606313564200-e75d5e30476c',
    color: 'green',
  },
  {
    id: 6,
    name: 'Millet peanut chikki',
    detail: 'Roasted peanuts and millet bound with jaggery',
    price: 149,
    unit: '6 pieces',
    category: 'Millet snacks',
    image: 'photo-1481391319762-47dff72954d9',
    color: 'orange',
    badge: 'Kitchen favorite',
  },
  {
    id: 7,
    name: 'Cocoa ragi nibbles',
    detail: 'Chocolatey little homemade bites',
    price: 189,
    unit: '140 g pack',
    category: 'Millet snacks',
    image: 'photo-1606313564200-e75d5e30476c',
    color: 'pink',
  },
  {
    id: 8,
    name: 'Millet chocolate cookies',
    detail: 'A homestyle bake with chocolate chips',
    price: 219,
    unit: '6 cookies',
    category: 'Biscuits',
    image: 'photo-1499636136210-6f4ee915583e',
    color: 'pink',
  },
]

const categories = ['All snacks', 'Biscuits', 'Chocolates', 'Millet snacks']

type CheckoutPageProps = {
  cart: Record<number, number>
  onBack: () => void
}

function CheckoutPage({ cart, onBack }: CheckoutPageProps) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null)
  const [detailsReady, setDetailsReady] = useState(false)
  const items = products.filter((product) => cart[product.id])
  const subtotal = items.reduce((total, product) => total + product.price * cart[product.id], 0)
  const discount = appliedCoupon === 'AMRUTHOS10' ? Math.round(subtotal * 0.1) : appliedCoupon === 'MILLET100' ? 100 : 0
  const delivery = subtotal >= 799 ? 0 : 49
  const packing = subtotal > 0 ? 15 : 0
  const total = subtotal - discount + delivery + packing

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase()
    if (code === 'AMRUTHOS10' && subtotal >= 499) {
      setAppliedCoupon(code)
      setCouponMessage({ text: '10% off your order has been applied.', success: true })
    } else if (code === 'MILLET100' && subtotal >= 999) {
      setAppliedCoupon(code)
      setCouponMessage({ text: '₹100 off your order has been applied.', success: true })
    } else if (code === 'AMRUTHOS10' || code === 'MILLET100') {
      setAppliedCoupon(null)
      setCouponMessage({ text: `This code needs a ${code === 'AMRUTHOS10' ? '₹499' : '₹999'} item subtotal.`, success: false })
    } else {
      setAppliedCoupon(null)
      setCouponMessage({ text: 'That code did not match an available offer.', success: false })
    }
  }

  return (
    <main className="checkout-page" id="top">
      <div className="checkout-heading">
        <button className="checkout-back" type="button" onClick={onBack}><ArrowLeft size={16} /> Back to basket</button>
        <div><span className="eyebrow">Just a few details</span><h1>Let's make it <em>yours.</em></h1><p>Your homemade Amruthos favorites, on their way to your door.</p></div>
      </div>
      <form className="checkout-layout" onSubmit={(event) => { event.preventDefault(); setDetailsReady(true) }}>
        <div className="checkout-fields">
          <section className="checkout-panel">
            <span className="checkout-step">01 / Delivery</span>
            <h2>Where should we bring the good stuff?</h2>
            <div className="checkout-input-grid">
              <label className="checkout-field"><span>Full name</span><input name="name" autoComplete="name" placeholder="Jamie Green" required /></label>
              <label className="checkout-field"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="jamie@example.com" required /></label>
              <label className="checkout-field"><span>Mobile number</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" required /></label>
              <label className="checkout-field"><span>House no. and street</span><input name="address" autoComplete="street-address" placeholder="12 MG Road" required /></label>
              <label className="checkout-field"><span>Area or landmark <small>Optional</small></span><input name="unit" autoComplete="address-line2" placeholder="Indiranagar" /></label>
              <label className="checkout-field"><span>City</span><input name="city" autoComplete="address-level2" placeholder="Bengaluru" required /></label>
              <label className="checkout-field"><span>State or union territory</span><select name="state" autoComplete="address-level1" defaultValue="" required><option value="" disabled>Select state</option><option>Andaman and Nicobar Islands</option><option>Andhra Pradesh</option><option>Arunachal Pradesh</option><option>Assam</option><option>Bihar</option><option>Chandigarh</option><option>Chhattisgarh</option><option>Dadra and Nagar Haveli and Daman and Diu</option><option>Delhi</option><option>Goa</option><option>Gujarat</option><option>Haryana</option><option>Himachal Pradesh</option><option>Jammu and Kashmir</option><option>Jharkhand</option><option>Karnataka</option><option>Kerala</option><option>Ladakh</option><option>Lakshadweep</option><option>Madhya Pradesh</option><option>Maharashtra</option><option>Manipur</option><option>Meghalaya</option><option>Mizoram</option><option>Nagaland</option><option>Odisha</option><option>Puducherry</option><option>Punjab</option><option>Rajasthan</option><option>Sikkim</option><option>Tamil Nadu</option><option>Telangana</option><option>Tripura</option><option>Uttar Pradesh</option><option>Uttarakhand</option><option>West Bengal</option></select></label>
              <label className="checkout-field"><span>PIN code</span><input name="postal" autoComplete="postal-code" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" title="Enter a valid 6-digit Indian PIN code" placeholder="560001" required /></label>
            </div>
          </section>
          <section className="checkout-panel delivery-panel">
            <span className="checkout-step">02 / Timing</span>
            <h2>Pick a delivery window</h2>
            <label className="checkout-field"><span>When works for you?</span><select name="delivery-window"><option>Next available - 9 am to 1 pm</option><option>Today - 1 pm to 5 pm</option><option>Tomorrow - 9 am to 1 pm</option></select></label>
            <label className="checkout-field"><span>Delivery notes <small>Optional</small></span><textarea name="delivery-notes" rows={2} placeholder="Building, floor, or delivery instructions" /></label>
          </section>
        </div>

        <aside className="checkout-summary">
          <div className="summary-title"><div><span className="checkout-step">03 / Your order</span><h2>Your Amruthos treats</h2></div><span className="summary-count">{items.reduce((count, product) => count + cart[product.id], 0)} items</span></div>
          <div className="checkout-items">{items.map((product) => <div className="checkout-item" key={product.id}>
            <img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=180&q=75`} alt="" />
            <div><strong>{product.name}</strong><span>Qty {cart[product.id]} · {formatPrice(product.price)} / {product.unit}</span></div>
            <b>{formatPrice(product.price * cart[product.id])}</b>
          </div>)}</div>
          <div className="coupon-box">
            <label htmlFor="coupon-code"><Tag size={15} /> Have a good code?</label>
            <div className="coupon-controls"><input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" /><button type="button" onClick={applyCoupon}>Apply</button></div>
            <p className="coupon-hint">Try AMRUTHOS10 for 10% off ₹499+ or MILLET100 for ₹100 off ₹999+.</p>
            {couponMessage && <p className={`coupon-message${couponMessage.success ? ' coupon-success' : ''}`} role="status">{couponMessage.text}</p>}
          </div>
          <div className="fee-breakdown">
            <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            {discount > 0 && <div className="discount-line"><span>Coupon ({appliedCoupon})</span><strong>−{formatPrice(discount)}</strong></div>}
            <div><span>Delivery {delivery === 0 ? '(on us)' : ''}</span><strong>{delivery === 0 ? 'Free' : formatPrice(delivery)}</strong></div>
            <div><span>Packing fee</span><strong>{formatPrice(packing)}</strong></div>
            <div><span>GST</span><strong>Included</strong></div>
            <div className="grand-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <p>GST is treated as included in item prices in this preview. Confirm GST and HSN treatment before taking orders.</p>
          </div>
          <button className="checkout-submit" type="submit">Continue to payment <ArrowRight size={17} /></button>
          <p className="payment-note">Payment processing is not connected in this preview.</p>
          {detailsReady && <p className="checkout-ready" role="status"><Check size={16} /> Delivery details are ready. Payment setup is needed to place an order.</p>}
        </aside>
      </form>
    </main>
  )
}

function App() {
  const [activeNav, setActiveNav] = useState(() => {
    const section = window.location.hash.slice(1)
    return ['shop', 'promise', 'newsletter'].includes(section) ? section : 'shop'
  })
  const [activeCategory, setActiveCategory] = useState('All snacks')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  useLayoutEffect(() => {
    if (checkoutOpen) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [checkoutOpen])

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 4)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All snacks' || product.category === activeCategory
    const matchesSearch = `${product.name} ${product.detail} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function changeQuantity(productId: number, adjustment: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + adjustment
      const next = { ...current }
      if (nextQuantity <= 0) delete next[productId]
      else next[productId] = nextQuantity
      return next
    })
  }

  const cartTotal = products.reduce((total, product) => total + product.price * (cart[product.id] ?? 0), 0)

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.scroll-reveal:not(.is-visible)')
    const showImmediately = () => targets.forEach((target) => target.classList.add('is-visible'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      showImmediately()
      return
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [activeCategory, search])

  useEffect(() => {
    const sectionIds = ['shop', 'promise', 'newsletter'] as const
    const visibleSections = new Set<string>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id)
        else visibleSections.delete(entry.target.id)
      })

      const activeSection = [...sectionIds].reverse().find((sectionId) => visibleSections.has(sectionId))
      if (activeSection) setActiveNav(activeSection)
    }, { rootMargin: '-105px 0px -15% 0px', threshold: 0 })

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="market-shell">
      <div className="announcement"><Leaf size={14} /> Homemade with millets and jaggery. Free delivery over ₹799 <span>Shop snacks <ArrowRight size={13} /></span></div>
      <header className={`site-header${headerScrolled ? ' is-scrolled' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Amruthos home" onClick={() => setCheckoutOpen(false)}>Amruthos<span>.</span></a>
        {!checkoutOpen && <nav className="main-nav" aria-label="Main navigation">
          <a className={activeNav === 'shop' ? 'nav-active' : ''} href="#shop" onClick={() => setActiveNav('shop')}>Shop snacks</a>
          <a className={activeNav === 'promise' ? 'nav-active' : ''} href="#promise" onClick={() => setActiveNav('promise')}>Our ingredients</a>
          <a className={activeNav === 'newsletter' ? 'nav-active' : ''} href="#newsletter" onClick={() => setActiveNav('newsletter')}>The Sunday note</a>
        </nav>}
        <div className="header-actions">
          {!checkoutOpen && <label className="search-box">
            <Search size={17} />
            <input aria-label="Search Amruthos snacks" placeholder="Find a favorite" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>}
          {checkoutOpen ? <button className="cart-button" onClick={() => setCheckoutOpen(false)}><ArrowLeft size={17} /><span>Market</span></button> : <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open basket, ${cartCount} items`}>
            <ShoppingBag size={18} /><span className="cart-label">Basket</span><span className="cart-count">{cartCount}</span>
          </button>}
        </div>
      </header>

      {checkoutOpen ? <CheckoutPage cart={cart} onBack={() => { setCheckoutOpen(false); setCartOpen(true) }} /> : <>
      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} /> Homemade, from our kitchen</span>
            <h1>Millet-made.<br /><em>Jaggery-sweet.</em></h1>
            <p>Homemade biscuits, chocolates and everyday snacks. Made with millets and jaggery, with no refined sugar added.</p>
            <a className="hero-cta" href="#shop">Find your snack <ArrowRight size={17} /></a>
            <div className="hero-note"><span className="avatar-stack"><i>A</i><i>M</i><i>A</i></span><span><strong>Made at home, in small batches.</strong><br />Millets, jaggery, and plenty of care</span></div>
          </div>
          <div className="hero-image-wrap">
            <img className="hero-image" src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1400&q=85" alt="A fresh batch of homemade biscuits ready to enjoy" />
            <div className="hero-sticker"><span>made<br />with <b>♥</b></span></div>
            <div className="hero-caption"><span className="caption-dot" /> Homemade batches <span>•</span> simple ingredients</div>
          </div>
          <div className="hero-scribble" aria-hidden="true">a little homemade happiness</div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="eyebrow section-eyebrow">Fresh from our kitchen</span><h2>Snack time, made <em>lovely.</em></h2></div>
            <a className="text-link" href="#promise">What goes into every batch <ArrowRight size={16} /></a>
          </div>
          <div className="shop-controls">
            <div className="category-list" role="group" aria-label="Filter by category">
              {categories.map((category) => <button key={category} className={`category-button${activeCategory === category ? ' selected' : ''}`} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
            <span className="result-count">{visibleProducts.length} homemade favorites</span>
          </div>
          {visibleProducts.length > 0 ? <div className="product-grid">
            {visibleProducts.map((product, index) => <article className="product-card scroll-reveal" key={product.id} style={{ transitionDelay: `${(index % 4) * 65}ms` }}>
              <div className={`product-image-frame ${product.color}`}>
                <img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=750&q=80`} alt={product.name} loading="lazy" />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className={`favorite-button${favorites.includes(product.id) ? ' favorited' : ''}`} onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} aria-label={favorites.includes(product.id) ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                {cart[product.id] ? <div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={15} /></button><span>{cart[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={15} /></button></div> : <button className="add-button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add ${product.name} to basket`}><Plus size={18} /></button>}
              </div>
              <div className="product-info"><span className="product-category">{product.category}</span><div className="product-title-row"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)}</span></div><p>{product.detail}</p><span className="product-unit">/{product.unit}</span></div>
            </article>)}
          </div> : <div className="empty-results"><Search size={22} /><p>Nothing on the shelf just yet.</p><button onClick={() => { setSearch(''); setActiveCategory('All snacks') }}>See everything</button></div>}
          <div className="harvest-banner"><div className="harvest-icon"><Leaf size={21} /></div><div><strong>Millets at the heart of every batch.</strong><p>Homemade with jaggery and no refined sugar added.</p></div><a href="#promise" aria-label="Learn about our ingredients"><ArrowRight size={19} /></a></div>
        </section>

        <section className="promise-section" id="promise">
          <div className="promise-photo scroll-reveal"><img src="https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1000&q=85" alt="Homemade chocolate treats prepared in small batches" loading="lazy" /><span>Made at home, by us.</span></div>
          <div className="promise-copy scroll-reveal"><span className="eyebrow">The Amruthos kitchen</span><h2>Good ingredients.<br /><em>Homemade care.</em></h2><p>We make biscuits, chocolates and snacks with millets, jaggery and familiar kitchen ingredients. Jaggery is still sugar, so our treats aren't sugar-free; we simply skip refined sugar.</p><a className="text-link" href="#shop">Find your new favorite <ArrowRight size={16} /></a><div className="promise-stats"><div><strong>Millets</strong><span>in every batch</span></div><div><strong>Small</strong><span>homemade batches</span></div><div><strong>No refined</strong><span>sugar added</span></div></div></div>
        </section>

        <section className="newsletter-section" id="newsletter"><div><span className="eyebrow">A little note from our kitchen</span><h2>Good things, made at home,<br /><em>straight to your inbox.</em></h2></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); (event.currentTarget as HTMLFormElement).reset() }}><label className="sr-only" htmlFor="email-address">Email address</label><input id="email-address" type="email" placeholder="Your email address" required /><button type="submit">Count me in <ArrowRight size={16} /></button><p>New small-batch flavors, kitchen notes, and snack-time ideas.</p></form></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top">Amruthos<span>.</span></a><span>Millet snacks, made with care.</span><span>© Amruthos 2026</span></footer>
      </>}

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" aria-label="Your basket"><div className="drawer-header"><div><span className="eyebrow">The good stuff</span><h2>Your basket <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close basket"><X size={20} /></button></div>{cartCount ? <><div className="cart-lines">{products.filter((product) => cart[product.id]).map((product) => <div className="cart-line" key={product.id}><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=200&q=75`} alt="" /><div className="cart-line-info"><strong>{product.name}</strong><span>{formatPrice(product.price)} / {product.unit}</span><div className="quantity-control drawer-quantity"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={14} /></button><span>{cart[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={14} /></button></div></div><b>{formatPrice(product.price * cart[product.id])}</b></div>)}</div><div className="drawer-footer"><div className="delivery-note"><Check size={16} />{cartTotal >= 799 ? 'Your delivery is on us!' : `${formatPrice(799 - cartTotal)} away from free delivery`}</div><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><button className="checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Go to checkout <ArrowRight size={17} /></button><p>Delivery, packing, GST, and coupons at checkout</p></div></> : <div className="empty-cart"><ShoppingBag size={31} /><h3>Your basket's taking a breather.</h3><p>Fill it with something lovely.</p><button className="hero-cta" onClick={() => setCartOpen(false)}>Back to the market <ArrowRight size={16} /></button></div>}</aside></div>}
    </div>
  )
}

export default App
