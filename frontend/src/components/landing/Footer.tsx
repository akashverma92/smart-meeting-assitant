// it contains the footer text 2025 © Smart Meeting Assistant. All rights reserved.

export default function Footer() {
  return (
    <footer className="relative z-10 text-center text-gray-500 py-10">
      © {new Date().getFullYear()} SmartMeet — All rights reserved.
    </footer>
  );
}
