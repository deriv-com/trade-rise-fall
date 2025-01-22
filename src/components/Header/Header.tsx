import { useCallback, useMemo } from "react";
import { Button } from "@deriv-com/quill-ui";
import { BrandDerivLogoCoralIcon } from "@deriv/quill-icons";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores/AuthStore";
import { balanceStore } from "../../stores/BalanceStore";
import "./Header.scss";

const Header = observer(function Header() {
  const navigate = useNavigate();
  
  const auth = useMemo(() => ({
    isAuthenticated: authStore.isAuthenticated,
    logout: authStore.logout
  }), [authStore.isAuthenticated, authStore.logout]);

  const balanceInfo = useMemo(() => ({
    balance: balanceStore.balance,
    currency: balanceStore.currency
  }), [balanceStore.balance, balanceStore.currency]);


  const handleLogout = useCallback(() => {
    auth.logout();
    navigate('/login');
  }, [auth.logout, navigate]);

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <nav className="header">
      <div className="header__left">
        <Link to="/" className="header__logo">
          <BrandDerivLogoCoralIcon height={30} width={30} />
          <span>Option Trading</span>
        </Link>
        <Link to="/dashboard" className="header__nav-link">
          Dashboard
        </Link>
      </div>
      <div className="header__right">
        {auth.isAuthenticated && (
          <div className="header__balance">
            {balanceInfo.balance} {balanceInfo.currency}
          </div>
        )}
        {auth.isAuthenticated ? (
          <Button 
            onClick={handleLogout}
            variant="primary" 
            size="md"
          >
            Log out
          </Button>
        ) : (
          <Button 
            onClick={handleLogin} 
            variant="primary" 
            size="md"
          >
            Log in
          </Button>
        )}
      </div>
    </nav>
  );
});

export default Header;
