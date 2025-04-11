import React from "react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="dark:bg-bg-secondary relative text-sms dark:text-gray-300 text-sm p-4 pt-[6rem] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[6rem] bg-gradient-to-b dark:bg-bg-secondary to-transparent z-0"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:gap-[5rem] justify-center items-center border-b border-gray-200 dark:border-sms pb-6">
          <div className="flex gap-4 items-center mb-4 md:mb-0">
            <p className="font-medium">Follow me</p>
            <ul className="flex gap-4">
              <li>
                <a
                  href="https://twitter.com/devsoso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sms hover:text-sms dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/devsoso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sms hover:text-sms dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <FaGithub size={20} />
                </a>
              </li>
              <li>
                <a
                  href="https://devsoso.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sms hover:text-sms dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <FaLinkedin size={20} />
                </a>
              </li>
            </ul>
          </div>
          <div className="flex gap-4 mb-4 md:mb-0">
            <p className="font-medium">Phone: </p>
            <a
              href="tel:+25078800000"
              className="text-sms hover:text-sms dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              +250788724867
            </a>
          </div>
          <div className="flex gap-4">
            <p className="font-medium">Email: </p>
            <a
              href="#"
              className="text-sms hover:text-sms dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              email@dev.com
            </a>
          </div>
        </div>
        <div className="my-4">
          <p className="text-sm text-center mt-2">
            2025 All rights reserved - Developers Hub
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-b from-transparent to-gray-200 dark:to-sms z-0"></div>
    </footer>
  );
}
