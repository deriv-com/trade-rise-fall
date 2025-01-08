import React from "react";
import { Button } from "@deriv-com/quill-ui";
import { BrandDerivLogoCoralIcon } from "@deriv/quill-icons";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.scss";

const Header: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <nav className="header">
      <a href="/" className="header__logo">
        <BrandDerivLogoCoralIcon height={30} width={30} />
        Copy Trading
      </a>
      {isAuthenticated ? (
        <Button onClick={logout} variant="secondary" size="md">
          Log out
        </Button>
      ) : (
        <Button onClick={login} variant="primary" size="md">
          Log in
        </Button>
      )}
    </nav>
  );
};

export default Header;
