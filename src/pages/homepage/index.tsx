import React from "react";
import { Button, Heading } from "@deriv-com/quill-ui";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../stores/AuthStore";
import { isLogged } from "../../common/utils";
import "./homepage.scss";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <div className="homepage__content">
        <Heading.H1 className="homepage__title">
          Deriv: Option Trading
        </Heading.H1>

        <Heading.H3 className="homepage__subtitle">
          Mirror the success of top traders automatically. Set up in minutes
        </Heading.H3>

        <Button
          onClick={() => {
            if (isLogged()) {
              navigate("/dashboard");
            } else {
              navigate("/login");
            }
          }}
          variant="primary"
          size="lg"
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
