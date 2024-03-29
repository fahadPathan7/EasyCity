import DarkButton from "../../components/darkButton/DarkButton";
import backendURL from "../../lib/backendURL";
import { useState } from "react";
import { Input, Space, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import "./LoginPage.css";
import { Button } from "antd";
import Cookies from "js-cookie";


const LoginForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "", // Changed 'phone' to 'username'
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user.username) message.info("ফোন নম্বর অথবা ইমেইল দিন");
    else if (!user.password) message.info("পাসওয়ার্ড দিন");
    else {
        const filter = { password: user.password, username: user.username }; // Ensure correct property names
        try {
            const response = await axios.post(backendURL + "/auth/login", filter, {
                withCredentials: true,
            });
            localStorage.setItem("token", "Bearer " + response.data.token);
            Cookies.set("token", "Bearer " + response.data.token);
            message.success("Congratulations! Login Successful");
            navigate("/userProfile", {
                state: {
                    userData: response.data.user,
                },
            });
        } catch (error) {
            setIsLoading(false);
            // Handling the specific error for invalid credentials
            if (error.response ) {
                message.error("লগইন তথ্য ভুল হয়েছে, অনুগ্রহ করে পুনরায় চেষ্টা করুন।"); // Example error message in Bengali
            } else {
                // Generic error message for other types of errors
                message.error(error.response ? error.response.data.msg : "An error occurred. Please try again later.");
            }
        }
    }
};


  return (
    <div>
      <form className="loginForm" onSubmit={handleSubmit}>
        {/* username (previously phone) */}
        <label htmlFor="username" className="login-form-label">
          ফোন নম্বর অথবা ইমেইল
        </label>
        <div className="login-form-row">
          <Space direction="vertical">
            <Input
              size="large"
              placeholder="ফোন নম্বর অথবা ইমেইল দিন"
              className="login-form-input"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
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
      </form>
    </div>
  );
};

export default LoginForm;