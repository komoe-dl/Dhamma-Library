import React from 'react';
import { Book } from '../types';
import { getFileUrl } from '../lib/pocketbase';

interface BookStructuredDataProps {
  book: Book;
}

export default function BookStructuredData({ book }: BookStructuredDataProps) {
  const fileUrl = getFileUrl(book.collectionId, book.id, book.file);
  const coverUrl = book.cover ? getFileUrl(book.collectionId, book.id, book.cover) : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.author
    },
    "description": book.summary,
    "image": coverUrl,
    "url": window.location.href,
    "workExample": [
      {
        "@type": "Book",
        "bookFormat": "https://schema.org/EBook",
        "potentialAction": {
          "@type": "ReadAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": fileUrl,
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
              "http://schema.org/AndroidPlatform",
              "http://schema.org/IOSPlatform"
            ]
          }
        }
      }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
}
