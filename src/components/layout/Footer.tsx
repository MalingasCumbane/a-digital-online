
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          <p className="text-sm text-gray-500">
            © {currentYear} Sistema de Registro Criminal - Ministério da Justiça
          </p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-sm text-gray-500 hover:text-gov-primary">
            Termos de Uso
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-gov-primary">
            Política de Privacidade
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-gov-primary">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
