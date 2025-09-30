import React from 'react';
export default function Footer() {
  return (
    <footer className="w-full text-center py-6 border-t border-gray-700">
      <p className="text-gray-400 text-sm">
        Made with ❤️ by Avatar | AuthApp © {new Date().getFullYear()} MyApp. All rights reserved.
      </p>
    </footer>
  );
}
