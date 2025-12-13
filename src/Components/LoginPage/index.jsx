import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import "./index.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSuccess = async (userInfo) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://speechtotextbackend-2owz.onrender.com/login",
        userInfo,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        const token = response.data.jwtToken;
        Cookies.set("token", token, { expires: 2, path: "/", sameSite: "Lax" });
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const onSubmitUser = (event) => {
    event.preventDefault();
    if (email !== "" && password !== "") {
      const userInfo = { email: email, password: password };
      setUserData(userInfo);
      setEmail("");
      setPassword("");
      onSuccess(userInfo);
    }
  };

  useEffect(() => {
    const jwtToken = Cookies.get("token");
    if (jwtToken) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="app-div p-9 flex md:flex-row flex-col justify-center items-center md:bg-none md:bg-[ul('')] bg-[url('https://static.vecteezy.com/system/resources/previews/011/427/589/non_2x/speech-to-text-app-voice-recognition-application-convert-speech-to-text-multi-language-speech-recognizer-voice-to-text-software-concept-flat-modern-illustration-vector.jpg')]  bg-[length:110%_100%] bg-center">
      <div className="flex flex-2 bg-center hidden md:inline">
        <img
          className="object-center"
          src="https://static.vecteezy.com/system/resources/previews/011/427/589/non_2x/speech-to-text-app-voice-recognition-application-convert-speech-to-text-multi-language-speech-recognizer-voice-to-text-software-concept-flat-modern-illustration-vector.jpg"
          alt="Speech To Text"
        />
      </div>
      <form
        onSubmit={onSubmitUser}
        className="login-div p-5 flex flex-1 bg-slate-800/15 md:bg-white w-sm rounded-3xl flex-col justify-start items-center border-2 border-blue-900 md:justify-center"
      >
        <h1 className='text-purple-950 text-4xl text-center md:text-blue-900 underline decoration-2 mb-10 font-semibold font-(font-family: "Roboto")'>
          User Login{" "}
        </h1>
        <div className="flex flex-col mb-3">
          <label
            htmlFor="email"
            className="text-purple-950 md:text-blue-900 font-medium text-xl"
          >
            Email
          </label>
          <input
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            className="bg-purple-300 w-78 md: border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-col mb-8">
          <label
            htmlFor="password"
            className="text-purple-950 md:text-blue-900 font-medium text-xl"
          >
            Password
          </label>
          <input
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            className="bg-purple-300 w-78 border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="self-center flex justify-center m-4">
          {isLoading ? (
            <TailSpin
              height="40"
              width="40"
              color="blue"
              ariaLabel="tail-spin-loading"
              visible={isLoading}
            />
          ) : (
            <button
              type="submit"
              className="login-btn py-2 text-white md:bg-blue-900 text-lg w-30 rounded-lg tracking-wide cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <p className="text-purple-950 text-center font-medium md:text-blue-900">
            Don't have an account?
          </p>
          <Link
            className="text-purple-950 font-semibold md:text-blue-900"
            to="/sign-in"
          >
            SignIn
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
