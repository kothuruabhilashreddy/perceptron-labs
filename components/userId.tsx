"use client";

export default function CurrentUserId(): string {
  return 'user_' + (window.location.port || '3000');
}
