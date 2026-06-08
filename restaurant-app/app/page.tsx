export default function Home() {
  return (
    <main>
      <div id="navbar">
        <img src="/SushiHouse.png"/>
        <div id="navbar-btn">
          <p>Accueil</p>
          <p>Menu</p>
          <p>A propos</p>
        </div>
        <div id="navbar-link">
          <p>Compte <i className="fa-solid fa-user"></i></p>
          <p>Panier <i className="fa-solid fa-bag-shopping"></i><span className="cart-badge">0</span></p>
        </div>
      </div>
    </main>
  );
}