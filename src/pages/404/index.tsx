import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./404.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <h2 className="not-found__subtitle">Page Not Found</h2>
        <p className="not-found__text">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
