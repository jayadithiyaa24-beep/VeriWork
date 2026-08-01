function Login() {
  return (
    <div className="container py-5">

      <h2>Login</h2>

      <div className="card p-4 shadow mt-4">

        <input
          className="form-control mb-3"
          placeholder="Email"
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
        />

        <button className="btn btn-primary">
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;