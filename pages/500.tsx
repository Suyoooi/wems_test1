import Link from "next/link"
export default function CustError() {
  return (
    <>
      <title>500</title>
      <div className="content__boxed rounded-0 w-100 min-vh-100 d-flex flex-column align-items-stretch justify-content-center">
        <div className="content__wrap">

          <div className="text-center">
            <div className="error-code page-title mb-3">500</div>
            <h3 className="mb-4">
              <div className="badge bg-info">Page not found !</div>
            </h3>
            <p className="lead">Sorry, but the page you are looking for has not been found on our server.</p>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button type="button" onClick={() => window.history.back()} className="btn btn-light">Go back</button>
            <Link href="/" className="btn btn-primary">Return home</Link>
          </div>
        </div>
      </div>
    </>
  )
}