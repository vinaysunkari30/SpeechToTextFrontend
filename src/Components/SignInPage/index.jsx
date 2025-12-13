import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

const SignInPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState();
  const [isClicked, setClicked] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSuccessSignIn = async (userInfo) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://speechtotextbackend-2owz.onrender.com/sign-in",
        userInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("User created successfully");
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data.message);
    }
  };

  const onSignIn = (event) => {
    event.preventDefault();
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== ""
    ) {
      const userInfo = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
      };
      setUserData(userInfo);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      onSuccessSignIn(userInfo);
    }
  };

  return (
    <div className="app-div p-5 flex md:flex-row flex-col justify-between items-center md:bg-none md:bg-[ul('')] bg-[url('https://static.vecteezy.com/system/resources/previews/011/427/589/non_2x/speech-to-text-app-voice-recognition-application-convert-speech-to-text-multi-language-speech-recognizer-voice-to-text-software-concept-flat-modern-illustration-vector.jpg')]  bg-[length:110%_100%] bg-center">
      <div className="flex flex-2 bg-center hidden md:inline">
        <img
          className="object-center"
          src="https://static.vecteezy.com/system/resources/previews/011/427/589/non_2x/speech-to-text-app-voice-recognition-application-convert-speech-to-text-multi-language-speech-recognizer-voice-to-text-software-concept-flat-modern-illustration-vector.jpg"
          alt="Speech To Text"
        />
      </div>
      <form
        onSubmit={onSignIn}
        className="login-div pt-3 flex-1 bg-slate-800/15 md:bg-white w-sm rounded-3xl flex flex-col justify-start items-center border-2 border-blue-900 md:justify-center"
      >
        <h2 className='text-purple-950 text-center text-4xl md:text-blue-900 underline decoration-2 mb-4 mt-2 font-semibold font-(font-family: "Roboto")'>
          User SignIn
        </h2>
        <div className="flex flex-col mb-2">
          <label
            htmlFor="firstName"
            className="text-purple-950 md:text-blue-900 font-medium text-base"
          >
            First Name
          </label>
          <input
            id="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}
            className="bg-purple-100 w-78 md:w-58 lg:w-80 border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="text"
            placeholder="First Name"
            required
          />
        </div>
        <div className="flex flex-col mb-2">
          <label
            htmlFor="lastName"
            className="text-purple-950 md:text-blue-900 font-medium text-base"
          >
            Last Name
          </label>
          <input
            id="lastName"
            onChange={(event) => setLastName(event.target.value)}
            value={lastName}
            className="bg-purple-100 w-78 md:w-58 lg:w-80 border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <div className="flex flex-col mb-2">
          <label
            htmlFor="email"
            className="text-purple-950 md:text-blue-900 font-medium text-base"
          >
            Email
          </label>
          <input
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            className="bg-purple-100 w-78 md:w-58 lg:w-80 border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-col mb-2">
          <label
            htmlFor="password"
            className="text-purple-950 md:text-blue-900 font-medium text-base"
          >
            Password
          </label>
          <input
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            className="bg-purple-100 w-78 md:w-58 lg:w-80 border-2 border-purple-950 h-11 pl-2 text-purple-950 font-medium rounded-md outline-0 placeholder-purple-950 md:text-blue-900 md:border-2 md:border-blue-900 md:placeholder-blue-900 md:bg-blue-200"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="self-center flex justify-center mb-2">
          <button
            type="submit"
            className="login-btn py-2 text-white md:bg-blue-900 text-lg w-30 rounded-lg tracking-wide cursor-pointer"
          >
            {isLoading ? (
              <TailSpin
                height="40"
                width="40"
                color="white"
                ariaLabel="tail-spin-loading"
                visible={isLoading}
              />
            ) : (
              <h1>SignIn</h1>
            )}
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-3">
          <p className="text-purple-950 text-center font-medium md:text-blue-900">
            Already have an account?
          </p>
          <Link
            className="text-purple-950 font-semibold md:text-blue-900"
            to="/login"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
