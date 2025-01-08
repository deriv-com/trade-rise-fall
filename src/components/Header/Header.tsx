import React from "react";
import { Button } from "@deriv-com/quill-ui";
import { BrandDerivLogoCoralIcon } from "@deriv/quill-icons";
import "./Header.scss";

const Header: React.FC = () => {
    const handleLoginClick = () => {
        window.location.href = `${process.env.OAUTH_URL}/oauth2/authorize?app_id=${process.env.REACT_APP_WS_PORT}`;
    };

  return (
    <nav className="header">
      <a href="/" className="header__logo">
        <BrandDerivLogoCoralIcon height={30} width={30} />
        Copy Trading
      </a>
      <Button onClick={handleLoginClick} variant="primary" size="md">
        Log in
      </Button>
    </nav>
  );
};

export default Header;
