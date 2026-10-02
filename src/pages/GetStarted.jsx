import { Link } from "react-router-dom";

function GetStarted() {
  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f4f8ff",
        minHeight: "70vh",
      }}
    >
      <div className="container">

        <div className="text-center mb-5">

          <h1 className="fw-bold">
            Welcome to VeriWork
          </h1>

          <p className="text-muted">
            Choose how you want to use VeriWork.
          </p>

        </div>


        <div className="row justify-content-center g-4">

          {/* Worker */}

          <div className="col-md-5">

            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center p-5">

                <div
                  style={{
                    fontSize: "50px",
                  }}
                >
                  👷
                </div>

                <h3 className="fw-bold mt-3">
                  Worker
                </h3>

                <p className="text-muted">
                  Create your digital work identity,
                  manage employment history and verify
                  your work records.
                </p>

                <div className="d-flex justify-content-center gap-2 flex-wrap">

                  <Link
                    to="/register-worker"
                    className="btn btn-primary"
                  >
                    Register
                  </Link>

                  <Link
                    to="/login"
                    className="btn btn-outline-primary"
                  >
                    Login
                  </Link>

                </div>

              </div>

            </div>

          </div>


          {/* Employer */}

          <div className="col-md-5">

            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center p-5">

                <div
                  style={{
                    fontSize: "50px",
                  }}
                >
                  🏢
                </div>

                <h3 className="fw-bold mt-3">
                  Employer
                </h3>

                <p className="text-muted">
                  Register workers, create employment
                  records and manage employee information.
                </p>

                <div className="d-flex justify-content-center gap-2 flex-wrap">

                  <Link
                    to="/register-employer"
                    className="btn btn-success"
                  >
                    Register
                  </Link>

                  <Link
                    to="/employer-login"
                    className="btn btn-outline-success"
                  >
                    Login
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default GetStarted;