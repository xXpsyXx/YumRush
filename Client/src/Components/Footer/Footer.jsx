import React from "react";

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                YumRush
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-gray-600">
              Delicious meals delivered fast from your favorite local
              restaurants.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Quick links
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a className="hover:text-emerald-600" href="#restaurants">
                  Restaurants
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#categories">
                  Categories
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Offers
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Order tracking
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Support
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Help center
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Report issue
                </a>
              </li>
              <li>
                <a className="hover:text-emerald-600" href="#">
                  Delivery info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Stay in the loop
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Get exclusive deals and the latest updates.
            </p>
            <form className="mt-3 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-emerald-500"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-600 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} YumRush. All rights reserved.</p>
          <div className="inline-flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-500 transition hover:text-emerald-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M19.633 7.997c.013.177.013.355.013.533 0 5.41-4.118 11.65-11.65 11.65-2.318 0-4.47-.68-6.28-1.85.33.04.648.053.99.053 1.92 0 3.69-.653 5.1-1.747a4.114 4.114 0 0 1-3.84-2.85c.256.04.512.066.782.066.376 0 .753-.053 1.103-.14a4.106 4.106 0 0 1-3.292-4.032v-.053c.54.3 1.166.48 1.83.506a4.096 4.096 0 0 1-1.833-3.414c0-.753.204-1.45.56-2.058a11.66 11.66 0 0 0 8.457 4.287 4.624 4.624 0 0 1-.102-.94 4.106 4.106 0 0 1 7.108-2.808 8.1 8.1 0 0 0 2.606-.993 4.12 4.12 0 0 1-1.804 2.27 8.23 8.23 0 0 0 2.365-.64 8.84 8.84 0 0 1-2.06 2.13Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-500 transition hover:text-emerald-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-500 transition hover:text-emerald-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M13 21v-7h2.5l.5-3H13V9.5c0-.87.28-1.5 1.7-1.5H16V5.1c-.3-.04-1.2-.1-2.1-.1-2.1 0-3.5 1.27-3.5 3.6V11H8v3h2.4v7H13Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
