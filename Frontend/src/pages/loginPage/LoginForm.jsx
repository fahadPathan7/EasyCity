import DarkButton from "../../components/darkButton/DarkButton";
import backendURL from "../../lib/backendURL";
import { useState } from "react";
import { Input, Space, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import "./LoginPage.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    phone: "",
    password: "",
  });
  const [setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (
      e.target.name === "phone" &&
      !(
        typeof Number(e.target.value) === "number" &&
        !Number.isNaN(Number(e.target.value))
      )
    )
      return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user.phone) message.info("ফোন নম্বর দিন");
    else if (!user.password) message.info("পাসওয়ার্ড দিন");
    else {
      //console.log("hello");
      //alert(JSON.stringify(user));
      const filter = { password: user.password, phone: "+88" + user.phone };
      try {
        const response = await axios.post(
          backendURL + "api/v1/auth/login",
          filter,
          { withCredentials: true }
        );
        //console.log(response);
        localStorage.setItem("token", "Bearer " + response.data.token);

        message.success("Congratulations! Login Successful");
        navigate("/home", {
          state: {
            user,
          },
        });

        setIsLoading(false);

        // setModalText(`Congratulations! Press OK to go to home page`);

        // setModalTitle("Your login is successfull");
        // setModalRoute("/home");
        // showModal();
      } catch (error) {
        message.error(error.response.data.msg);
        // setModalText();
        // setModalTitle("An Error Occured");
        // setModalRoute(null);
        // showModal();

        //alert(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <form className="loginForm" onSubmit={handleSubmit}>
        {/* name */}
        <label htmlFor="name" className="login-form-label">
          ফোন নম্বর
        </label>
        <div className="login-form-row">
          <Space direction="vertical">
            <Input
              size="large"
              placeholder="ফোন নম্বর দিন"
              className="login-form-input"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              addonBefore="+88"
            />
          </Space>
        </div>
        {/* password */}
        <label htmlFor="password" className="login-form-label">
          পাসওয়ার্ড
        </label>
        <div className="login-form-row">
          <Space direction="horizontal">
            <Input.Password
              size="large"
              placeholder="পাসওয়ার্ড দিন"
              className="login-form-input"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              visibilityToggle={{
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Space>
        </div>

        {!isLoading ? (
          <DarkButton
            buttonText="প্রবেশ করুন"
            onClick={() => {}}
            routePath="forbidden"
            type="submit"
          />
        ) : (
          <>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 70,
                    color: "black",
                  }}
                  spin
                />
              }
            />
            <div>It will take few minutes for the first time login</div>
          </>
        )}
        {/* <DarkButton
          buttonText="প্রবেশ করুন"
          onClick={() => {}}
          routePath="forbidden"
          type="submit"
        /> */}
      </form>
    </div>
  );
};

export default LoginForm;
