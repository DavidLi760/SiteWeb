export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-10">
      <div className="flex justify-between">
        <p>© 2026 Sushi House</p>

        <div className="flex gap-8">
          <a href="/legal">Mentions légales</a>
          <a href="/privacy">Confidentialité (RGPD)</a>
          <a href="/cookies">Cookies</a>
          <a href="/contact">  Contact</a>
        </div>
      </div>
    </footer>
  );
}