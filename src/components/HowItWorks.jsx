function HowItWorks() {
  const steps = [
    "Register as Worker",
    "Employer Creates Contract",
    "Salary is Verified",
    "Receive Blockchain Work Identity",
  ];

  return (
    <section id="how-it-works" className="container py-5">

      <h2 className="text-center fw-bold mb-5">
        How It Works
      </h2>

      <div className="row">

        {steps.map((step, index) => (

          <div className="col-md-3 text-center" key={index}>

            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "24px",
              }}
            >
              {index + 1}
            </div>

            <h5>{step}</h5>

          </div>

        ))}

      </div>

    </section>
  );
}

export default HowItWorks;