"use client"

import { useState } from "react"
import CopyToClipboard from "./copy-to-clipboard"

export default function Demo() {
  const [customText, setCustomText] = useState("Type your custom text here...")

  const designExamples = [
    {
      title: "Default Style",
      description: "Clean and minimal design",
      textToCopy: "npm install framer-motion",
      props: { variant: "default" as const, size: "md" as const },
    },
    {
      title: "Primary Button",
      description: "Bold blue primary style",
      textToCopy: "https://github.com/vercel/next.js",
      props: { variant: "primary" as const, size: "md" as const },
    },
    {
      title: "Secondary Style",
      description: "Purple accent color",
      textToCopy: "const greeting = 'Hello World!';",
      props: { variant: "secondary" as const, size: "md" as const },
    },
    {
      title: "Outline Style",
      description: "Transparent with border",
      textToCopy: "yarn add @framer-motion/react",
      props: { variant: "outline" as const, size: "md" as const },
    },
    {
      title: "Ghost Style",
      description: "Minimal without border",
      textToCopy: "git clone https://github.com/user/repo.git",
      props: { variant: "ghost" as const, size: "md" as const },
    },
    {
      title: "Minimal Round",
      description: "Compact circular design",
      textToCopy: "docker run -p 3000:3000 myapp",
      props: { variant: "minimal" as const, size: "md" as const },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Copy to Clipboard</h1>
          <p className="text-gray-600">Clean and minimal design</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="space-y-6">
            {designExamples.map((example, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <code className="text-sm text-gray-700">{example.textToCopy}</code>
                <CopyToClipboard textToCopy={example.textToCopy} {...example.props} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <div className="space-y-4">
            <label htmlFor="custom-input" className="block text-sm font-medium text-gray-700">
              Try with your own text:
            </label>
            <input
              id="custom-input"
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type anything you want to copy..."
            />
            <div className="flex justify-center">
              <CopyToClipboard textToCopy={customText} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
