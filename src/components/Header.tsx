import Image from "next/image";
export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <div className="logo-container">
            <Image
              src="/images/Recipe_Chatbot_Logo.jpg"
              alt="Recipe Chatbot Logo"
              width={100}
              height={100}
              className="logo-image"
            />

            <span className="logo-text">Recipe Chatbot</span>
          </div>
        </div>

        {/* Center - Empty for now */}
        <div className="header-center">
          {/* Empty space for future content */}
        </div>

        {/* Profile Icon */}
        <div className="header-profile">
          <div className="profile-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="profile-svg"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
