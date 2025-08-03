"use client";

import React, { ReactNode } from "react";

interface BlogDetailLayoutProps {
  title: string;
  publishedDate: string;
  imageUrl?: string | null;
  content: string[];
  saveButton?: ReactNode;  
}

export default function BlogDetailLayout({
  title,
  publishedDate,
  imageUrl,
  content,
  saveButton,
}: BlogDetailLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-background text-foreground">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400">Published on {publishedDate}</p>
      </header>

      {/* Featured Image with Save Button Overlay */}
      {imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-md relative">
          <img
            src={imageUrl}
            alt="Blog Featured"
            className="w-full h-auto object-cover"
          />
          {/* Render the Save Button if provided */}
          {saveButton && (
            <div className="absolute top-3 right-3">
              {saveButton}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <article className="prose lg:prose-xl prose-gray max-w-none leading-loose space-y-6">
        {content.map((paragraph, idx) => (
          <p
            key={idx}
            className={`text-lg sm:text-xl leading-relaxed transition-opacity duration-500 ${
              idx === 0
                ? "first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left text-justify"
                : "text-justify"
            }`}
          >
            {paragraph.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        ))}
      </article>
    </div>
  );
}
