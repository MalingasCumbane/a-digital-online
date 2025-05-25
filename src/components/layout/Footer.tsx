
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3 sm:py-4 px-3 sm:px-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">
            © {currentYear} Sistema de Registro Criminal - Ministério da Justiça
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gov-primary">
            Termos de Uso
          </a>
          <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gov-primary">
            Política de Privacidade
          </a>
          <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gov-primary">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
