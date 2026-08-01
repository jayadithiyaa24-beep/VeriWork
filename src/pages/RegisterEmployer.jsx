function RegisterEmployer() {
  return (
    <div className="container py-5">
      <div className="card shadow p-5">

        <h2 className="text-primary mb-4">
          Employer Registration
        </h2>

        <form>

          <div className="mb-3">
            <label className="form-label">
              Employer Name
            </label>

            <input
              className="form-control"
              placeholder="Enter Employer Name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Mobile Number
            </label>

            <input
              className="form-control"
              placeholder="Enter Mobile Number"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
            />
          </div>

          <button className="btn btn-success">
            Register Employer
          </button>

        </form>

      </div>
    </div>
  );
}

export default RegisterEmployer;